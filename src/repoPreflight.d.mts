export type PreflightStatus = "met" | "partial" | "not_evidenced";

export interface RepositoryReference {
  owner: string;
  repository: string;
  slug: string;
}

export interface PreflightEvidence {
  detail: string;
  kind: "path" | "content";
  line?: number;
  path: string;
  sourceUrl: string;
}

export interface PreflightCheck {
  evidence: PreflightEvidence[];
  id: string;
  label: string;
  maxScore: number;
  score: number;
  status: PreflightStatus;
  summary: string;
}

export interface PreflightResult {
  checks: PreflightCheck[];
  inspectedFiles: string[];
  inspectionWarnings: string[];
  limitations: string[];
  nextSteps: string[];
  repository: {
    archived: boolean;
    defaultBranch: string;
    fullName: string;
    revisionSha: string;
    treeSha: string;
    webUrl: string;
  };
  score: {
    band:
      | "well_evidenced"
      | "partially_evidenced"
      | "limited_public_evidence";
    earned: number;
    maximum: number;
    percentage: number;
  };
}

export interface PreflightSnapshot {
  archived: boolean;
  defaultBranch: string;
  files: Map<
    string,
    { path: string; sha: string; size: number | null }
  >;
  fullName: string;
  revisionSha: string;
  treeSha: string;
  webUrl: string;
}

export class RepositoryPreflightError extends Error {
  code: string;
  constructor(message: string, code?: string);
}

export function parseRepositoryInput(value: string): RepositoryReference;

export function runRepositoryPreflight(
  value: string,
  options?: { fetchImpl?: typeof fetch },
): Promise<PreflightResult>;

export function scoreRepositorySnapshot(
  snapshot: PreflightSnapshot,
  textFiles?: Map<
    string,
    { path: string; sourceUrl: string; text: string | null }
  >,
  warnings?: string[],
): PreflightResult;
