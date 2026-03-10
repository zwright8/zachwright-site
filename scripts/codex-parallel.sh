#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Run multiple Codex agents in parallel from prompt files.

Usage:
  bash scripts/codex-parallel.sh [options]

Options:
  -d, --dir <path>          Prompt directory (default: codex-jobs)
  -j, --jobs <n>            Max parallel workers (default: 3)
  -m, --model <name>        Optional model override (default: use Codex default)
      --sandbox <mode>      Sandbox mode for each worker (default: workspace-write)
      --base-branch <name>  Base branch for worktrees (default: current branch)
      --run-id <id>         Run identifier (default: timestamp)
      --state-dir <path>    Directory for runs/worktrees (default: codex-state)
      --branch-prefix <p>   Branch prefix ending with '/' (default: auto from codex/)
      --dry-run             Prepare worktrees and outputs, skip Codex API calls
  -h, --help                Show this help

Prompt file format:
  Put one prompt per file in codex-jobs/*.prompt.md
EOF
}

JOBS_DIR="codex-jobs"
MAX_PARALLEL="3"
MODEL=""
SANDBOX_MODE="workspace-write"
BASE_BRANCH=""
RUN_ID="$(date +%Y%m%d-%H%M%S)"
DRY_RUN="0"
STATE_DIR="codex-state"
BRANCH_PREFIX="codex/"
CODEX_BIN="${CODEX_BIN:-codex}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    -d|--dir)
      JOBS_DIR="${2:-}"
      shift 2
      ;;
    -j|--jobs)
      MAX_PARALLEL="${2:-}"
      shift 2
      ;;
    -m|--model)
      MODEL="${2:-}"
      shift 2
      ;;
    --sandbox)
      SANDBOX_MODE="${2:-}"
      shift 2
      ;;
    --base-branch)
      BASE_BRANCH="${2:-}"
      shift 2
      ;;
    --run-id)
      RUN_ID="${2:-}"
      shift 2
      ;;
    --state-dir)
      STATE_DIR="${2:-}"
      shift 2
      ;;
    --branch-prefix)
      BRANCH_PREFIX="${2:-}"
      shift 2
      ;;
    --dry-run)
      DRY_RUN="1"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if ! [[ "$MAX_PARALLEL" =~ ^[0-9]+$ ]] || [[ "$MAX_PARALLEL" -lt 1 ]]; then
  echo "--jobs must be a positive integer. Got: $MAX_PARALLEL" >&2
  exit 1
fi

if ! command -v "$CODEX_BIN" >/dev/null 2>&1; then
  echo "Codex CLI not found: $CODEX_BIN" >&2
  exit 1
fi

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "$ROOT_DIR" ]]; then
  echo "This script must run inside a git repository." >&2
  exit 1
fi
cd "$ROOT_DIR"

if [[ -z "$BASE_BRANCH" ]]; then
  BASE_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
fi
if [[ "$BASE_BRANCH" == "HEAD" ]]; then
  echo "Detached HEAD detected. Pass --base-branch <name>." >&2
  exit 1
fi

if [[ -z "$BRANCH_PREFIX" ]]; then
  BRANCH_PREFIX="codex/"
fi
case "$BRANCH_PREFIX" in
  */) ;;
  *)
    echo "--branch-prefix must end with '/'. Got: $BRANCH_PREFIX" >&2
    exit 1
    ;;
esac

if [[ "$BRANCH_PREFIX" == "codex/" ]] && git show-ref --verify --quiet refs/heads/codex; then
  BRANCH_PREFIX="codex-parallel/"
  echo "Branch 'codex' already exists; using prefix '$BRANCH_PREFIX' instead."
fi

if [[ ! -d "$JOBS_DIR" ]]; then
  echo "Prompt directory not found: $JOBS_DIR" >&2
  exit 1
fi

PROMPT_FILES=()
while IFS= read -r file; do
  PROMPT_FILES+=("$file")
done < <(find "$JOBS_DIR" -maxdepth 1 -type f -name '*.prompt.md' | LC_ALL=C sort)

if [[ "${#PROMPT_FILES[@]}" -eq 0 ]]; then
  echo "No prompt files found in $JOBS_DIR (*.prompt.md)." >&2
  exit 1
fi

if [[ "$STATE_DIR" = /* ]]; then
  STATE_ROOT="$STATE_DIR"
else
  STATE_ROOT="$ROOT_DIR/$STATE_DIR"
fi

WORKTREE_ROOT="$STATE_ROOT/worktrees/$RUN_ID"
OUTPUT_ROOT="$STATE_ROOT/runs/$RUN_ID"
mkdir -p "$WORKTREE_ROOT" "$OUTPUT_ROOT"

echo "Run ID: $RUN_ID"
echo "Base branch: $BASE_BRANCH"
echo "Branch prefix: $BRANCH_PREFIX"
echo "Prompt files: ${#PROMPT_FILES[@]}"
echo "Max parallel: $MAX_PARALLEL"
echo "Worktrees: $WORKTREE_ROOT"
echo "Outputs: $OUTPUT_ROOT"

run_one_job() {
  local prompt_file="$1"
  local raw_name
  local job_name
  local branch_name
  local worktree_dir
  local job_prefix
  local rc
  local status
  local -a cmd

  raw_name="$(basename "$prompt_file" .prompt.md)"
  job_name="$(printf '%s' "$raw_name" | tr '[:upper:] ' '[:lower:]-' | tr -cd 'a-z0-9._-')"
  if [[ -z "$job_name" ]]; then
    job_name="job"
  fi

  branch_name="${BRANCH_PREFIX}${RUN_ID}-${job_name}"
  worktree_dir="$WORKTREE_ROOT/$job_name"
  job_prefix="$OUTPUT_ROOT/$job_name"

  {
    echo "job_name=$job_name"
    echo "prompt_file=$prompt_file"
    echo "branch_name=$branch_name"
    echo "worktree_dir=$worktree_dir"
  } > "$job_prefix.meta.txt"

  echo "[start] $job_name"

  if ! git worktree add -b "$branch_name" "$worktree_dir" "$BASE_BRANCH" \
    > "$job_prefix.worktree.log" 2>&1; then
    status="worktree_failed"
    printf "%s\t%s\t%s\t%s\t%s\n" \
      "$job_name" "$status" "$branch_name" "$worktree_dir" "$prompt_file" \
      > "$job_prefix.status.tsv"
    echo "[fail] $job_name ($status)"
    return 1
  fi

  if [[ "$DRY_RUN" == "1" ]]; then
    status="skipped_dry_run"
    echo "Dry run: Codex execution skipped." > "$job_prefix.final.txt"
    printf "%s\t%s\t%s\t%s\t%s\n" \
      "$job_name" "$status" "$branch_name" "$worktree_dir" "$prompt_file" \
      > "$job_prefix.status.tsv"
    echo "[done] $job_name ($status)"
    return 0
  fi

  cmd=( "$CODEX_BIN" exec --full-auto -C "$worktree_dir" -s "$SANDBOX_MODE" --json -o "$job_prefix.final.txt" )
  if [[ -n "$MODEL" ]]; then
    cmd+=( -m "$MODEL" )
  fi
  cmd+=( - )

  set +e
  "${cmd[@]}" < "$prompt_file" > "$job_prefix.events.jsonl" 2> "$job_prefix.stderr.log"
  rc=$?
  set -e

  if [[ "$rc" -eq 0 ]]; then
    status="success"
    printf "%s\t%s\t%s\t%s\t%s\n" \
      "$job_name" "$status" "$branch_name" "$worktree_dir" "$prompt_file" \
      > "$job_prefix.status.tsv"
    echo "[done] $job_name ($status)"
    return 0
  fi

  status="failed_$rc"
  printf "%s\t%s\t%s\t%s\t%s\n" \
    "$job_name" "$status" "$branch_name" "$worktree_dir" "$prompt_file" \
    > "$job_prefix.status.tsv"
  echo "[fail] $job_name ($status)"
  return "$rc"
}

OVERALL_STATUS=0
ACTIVE_PIDS=()

reap_finished() {
  local still_running=()
  local pid
  if [[ "${#ACTIVE_PIDS[@]}" -eq 0 ]]; then
    return 0
  fi
  for pid in "${ACTIVE_PIDS[@]}"; do
    if kill -0 "$pid" 2>/dev/null; then
      still_running+=( "$pid" )
    else
      if ! wait "$pid"; then
        OVERALL_STATUS=1
      fi
    fi
  done
  if [[ "${#still_running[@]}" -gt 0 ]]; then
    ACTIVE_PIDS=( "${still_running[@]}" )
  else
    ACTIVE_PIDS=()
  fi
}

start_job() {
  local prompt_file="$1"
  run_one_job "$prompt_file" &
  ACTIVE_PIDS+=( "$!" )
}

for prompt_file in "${PROMPT_FILES[@]}"; do
  while true; do
    reap_finished
    if [[ "${#ACTIVE_PIDS[@]}" -lt "$MAX_PARALLEL" ]]; then
      break
    fi
    sleep 0.2
  done
  start_job "$prompt_file"
done

if [[ "${#ACTIVE_PIDS[@]}" -gt 0 ]]; then
  for pid in "${ACTIVE_PIDS[@]}"; do
    if ! wait "$pid"; then
      OVERALL_STATUS=1
    fi
  done
fi

SUMMARY_FILE="$OUTPUT_ROOT/summary.tsv"
{
  printf "job\tstatus\tbranch\tworktree\tprompt_file\n"
  cat "$OUTPUT_ROOT"/*.status.tsv
} > "$SUMMARY_FILE"

echo ""
echo "Summary file: $SUMMARY_FILE"
if command -v column >/dev/null 2>&1; then
  column -t -s $'\t' "$SUMMARY_FILE"
else
  cat "$SUMMARY_FILE"
fi

if [[ "$OVERALL_STATUS" -ne 0 ]]; then
  echo ""
  echo "One or more jobs failed. Check *.stderr.log in $OUTPUT_ROOT." >&2
fi

exit "$OVERALL_STATUS"
