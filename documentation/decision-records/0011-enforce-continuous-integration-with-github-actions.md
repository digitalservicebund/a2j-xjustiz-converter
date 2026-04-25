---
status: proposed
date: 2026-04-24
---

# Enforce Continuous Integration with GitHub Actions

## Context and Problem Statement

We need a continuous integration service to run our workflows to verify codebase
integrity with automated quality assurance. Furthermore, we need time scheduled
workflows to frequently validate the codebase health.

Which continuous integration service should we use?

## Decision Drivers

- Capability to use the development environment of the repository
- Capability to use the central workflow orchestrator of the repository
- Provide file system caching to improve runtime durations
- Possibility to securely inject secrets to restriction tasks like releases
- Possibility to trigger workflows on a time schedule
- Ability to upload artifacts as result of a pipeline
- Provision of scalable virtual computation resources

## Decision Outcome

Chosen option: "GitHub Actions", because it is the standard by the company.

We also add [actionlint](https://github.com/rhysd/actionlint) as static code
analysis tool to reduce the likelihood that our pipelines fail due to
configuration mistakes.

### Positive Consequences

- Good, because we automate our quality checks centrally in extension to local measures
- Good, because workflows can trigger on version control system events or on a time schedule
- Good, because it creates a trusted environment for critical tasks like releases

## More Information

Because the pipelines should use the development environment and trigger
a single workflow by the workflow orchestrator, performance becomes a concern.
GitHub Actions supports concurrency via multiple jobs that run on separate
virtual machines. Having the workflow orchestrator being responsible for
concurrency and the whole tree of jobs/tasks, resources don't scale
horizontally. Instead, this needs vertical scaling of a single virtual machine
with more resources. Unfortunately, virtual scaling is more restricted by GitHub
Actions and must be paid. We'll have to monitor how this affects the runtime of
the workflows to take measures if it becomes limiting.
