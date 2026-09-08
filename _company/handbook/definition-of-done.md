# Definition of Done

A packet is Done only if:
1. Acceptance criteria met (or explicitly waived by PM/CEO)
2. Critical-path tests exist and pass
3. Errors/empty/loading states handled (UI) or error contract documented (API)
4. No secrets committed
5. Observability: meaningful logs/events for the feature
6. Handoff note in outbox with risks + next owner
7. Docs/ADR updated if decision locked
8. Analytics events match PRD names (if user-facing)

“Works on my machine” is not Done.
