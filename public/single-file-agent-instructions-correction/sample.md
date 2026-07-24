# Complete Single-File Correction Pack

This is a historical WrightOps-owned public-repository example, not customer
work, a testimonial, or a claimed buyer outcome. It shows the complete shape of
the fixed $149 deliverable for one factual correction in one existing
instructions file.

## Confirmed scope

- Repository:
  [wrightops-ai/agent-ready-repo-auditor](https://github.com/wrightops-ai/agent-ready-repo-auditor)
- Accepted source revision:
  [`a5c77f4106e47240dcea302da2bbf4d05f1a2eb0`](https://github.com/wrightops-ai/agent-ready-repo-auditor/tree/a5c77f4106e47240dcea302da2bbf4d05f1a2eb0)
- Corrected revision:
  [`7a507bc0cb42f8c04fb18e53a46371b37b5bd56f`](https://github.com/wrightops-ai/agent-ready-repo-auditor/commit/7a507bc0cb42f8c04fb18e53a46371b37b5bd56f)
- Existing file: root `AGENTS.md`
- Source size: 7 lines
- Correction: state the existing approval boundary with direct, auditable
  verbs rather than a mixed list of abstract access categories
- Files changed: 1

## Complete replacement Markdown

```markdown
# Coding-agent instructions

Keep this project dependency-free at runtime and compatible with Python 3.10 or newer.

Run `python3 -m unittest discover -v` and the documented compile check after changes. Every positive audit finding must link to immutable public GitHub evidence. Missing or ambiguous evidence must fail closed; never infer that a repository is safe, secure, or compliant.

Do not clone or execute audited repository code. Do not publish, deploy, handle payments, use credentials, or access private data without explicit operator approval and dedicated security review.
```

Replacement Markdown SHA-256:
`161bbeff67ca2a5f0cb92cdd0fb0e5831ee17acb2e582072bee790f57c18f576`

## Ready-to-apply unified diff

```diff
diff --git a/AGENTS.md b/AGENTS.md
index b50566d..a40362e 100644
--- a/AGENTS.md
+++ b/AGENTS.md
@@ -4,4 +4,4 @@ Keep this project dependency-free at runtime and compatible with Python 3.10 or
 
 Run `python3 -m unittest discover -v` and the documented compile check after changes. Every positive audit finding must link to immutable public GitHub evidence. Missing or ambiguous evidence must fail closed; never infer that a repository is safe, secure, or compliant.
 
-Do not clone or execute audited repository code. Do not add private-repository access, credential collection, deployment, publishing, payment, or customer-data handling without explicit operator approval and dedicated security review.
+Do not clone or execute audited repository code. Do not publish, deploy, handle payments, use credentials, or access private data without explicit operator approval and dedicated security review.
```

## Claim-to-source evidence

| Claim | Public evidence | Result |
| --- | --- | --- |
| The selected file existed at the accepted revision. | [Parent-revision `AGENTS.md`](https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/a5c77f4106e47240dcea302da2bbf4d05f1a2eb0/AGENTS.md) | Confirmed |
| The source file was below the 250-line cap. | The immutable parent blob contains 7 lines and has SHA-256 `2331273ab3f2b67abd96a4291f9c9046905ca3448382f99314065cab88de8d05`. | Confirmed |
| Only the selected file changed. | [Immutable commit diff](https://github.com/wrightops-ai/agent-ready-repo-auditor/commit/7a507bc0cb42f8c04fb18e53a46371b37b5bd56f) | Confirmed: 1 file, 1 insertion, 1 deletion |
| The replacement matches the committed result. | [Corrected `AGENTS.md`](https://github.com/wrightops-ai/agent-ready-repo-auditor/blob/7a507bc0cb42f8c04fb18e53a46371b37b5bd56f/AGENTS.md) | Confirmed |
| The correction did not include application code, CI, dependencies, or configuration changes. | [Immutable commit file list](https://github.com/wrightops-ai/agent-ready-repo-auditor/commit/7a507bc0cb42f8c04fb18e53a46371b37b5bd56f) | Confirmed |

## Acceptance checks

- [x] Exactly one existing eligible instructions file is in scope.
- [x] The accepted public source revision is immutable.
- [x] The source file is no more than 250 lines.
- [x] Complete replacement Markdown is included.
- [x] The unified diff changes only `AGENTS.md`.
- [x] The before and after blobs are independently inspectable.
- [x] No buyer-repository branch, pull request, comment, or merge is part of the
  fixed service deliverable.
- [x] No private code, credentials, customer data, production access,
  application-code change, or repository-code execution is required.

## Limitations

This sample proves the deliverable shape and its public evidence, not that the
same wording fits another repository. Each engagement requires written scope,
one accepted public revision, and provider-confirmed settled payment before
work begins. The buyer reviews and applies the patch. WrightOps does not
guarantee adoption, merge, or any business or technical outcome.

[Build a non-binding $149 scope request](https://zachwright.xyz/single-file-agent-instructions-correction/#scope-builder)
