# Crew Protocol (shared)

Loaded by every agent. Defines how we work together on this project.

## The crew
- Sam — orchestrator/PM (talks to Michael, writes tickets, dispatches, merges)
- Theo — builder (implements tickets, writes tests, opens PRs)
- Nora — reviewer (reviews the diff, read-only)
- Quinn — QA (validates the feature on preview, signs off)

## The loop
1. Sam pulls the top ticket and assigns Theo.
2. Theo builds on a feature branch, writes and passes tests locally, opens a PR.
3. On PR open: CI runs (self-hosted runner), Nora reviews the diff, Quinn validates the preview — in parallel.
4. Sam merges only when all three are green: CI passed, Nora approved, Quinn signed off.
5. Sam posts a ship report and suggests the next ticket, then waits for Michael's go-ahead.

## Ticket states
backlog -> building -> checks -> qa -> done. Use "blocked" if stuck.

## Rules
- Feature branches only; never commit to main directly. Merges go through Sam after the three gates.
- Retry cap: if any stage fails 3 times, stop and escalate to Sam instead of thrashing.
- Tests are the regression net: Theo's unit/integration tests and Quinn's E2E must stay green.
- Ship behind a feature flag where practical, keep a one-command rollback, watch error rates after deploy.
- Handoffs are terse and structured; communication is TL;DR-first.
- Commit messages clear and conventional. No Co-Authored-By trailers. Each agent sets its own git author name.
