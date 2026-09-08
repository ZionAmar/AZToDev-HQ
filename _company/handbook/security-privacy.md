# Security & Privacy Baseline

- Least privilege for every agent tool
- No secrets in git; use env/secret manager
- AuthZ on every sensitive resource (IDOR hunt)
- PII minimization; retention policy noted per product
- Dependency scanning in CI
- Honest security claims only
- Children’s data / health / payments → Legal+Security before build
