---
status: proposed
date: 2026-04-23
---

# Use Git Hooks with Lefthook

## Context and Problem Statement

We embrace the shift left pattern and want to detect issues early. Therefore,
automated quality assurance when checking files into the version control system
provide early feedback, before it hits the continuous integration pipelines.

Our repository provides a reproducible development environment and uses
a central workflow orchestrator. What we need is a link into the hook system of
the version control system to run a matching workflow per event. It must be
capable to provide a clean staging environment, especially for partially staged
files, and automatically stage files again which changed by formatting or other
modifications.

Which Git hook manager should we use?

## Decision Drivers

- Compatible with Git as version control system
- Capability to provide clean staging environment to run pre-commit hook in
- Capability to apply staged files that have been modified by pre-commit hook
- It should be compatible with the development environment without their own package system
- Simplicity in presence of the workflow orchestrator that takes a lot of responsibility
- Agnostic to the programming languages in the repository
- Quick to set up on local machine

## Considered Options

- Lefthook
- pre-commit
- Husky
- plain scripts

## Decision Outcome

Chosen option: "Lefthook", because it is a lightweight yet powerful Git hook
manager that aligns with all requirements. Furthermore, it is basically the
unofficial standard used by the company. The team is familiar and content with it.

### Positive Consequences

- Good, because developers receive quality assurance feedback early
- Good, because the continuous integration pipelines are relieved of unnecessary failing workflows
- Good, because it bridges the gap between Git events and workflow orchestrator
- Good, because it the hook manager itself barely adds latency
- Good, because we can just use our development environment as it is
- Good, because developers still have flexibility for their local setup
- Neutral, because no ecosystem of re-usable plugins to integrate with

## Pros and Cons of the Options

### Lefthook

[Link to GitHub project](https://github.com/evilmartians/lefthook)

- Good, because it is completely agnostic to the environment and programming languages
- Good, because it handles partially staged files well and applies back fixes
- Good, because it runs as performant Go binary with concurrency capabilities
- Good, because it allows for developer local additions
- Neutral, because does not provide an ecosystem of plugins

### Pre-Commit

[Link to GitHub project](https://github.com/pre-commit/pre-commit)

- Good, because it handles partially staged files well
- Neutral, because it provides a rich ecosystem of plugins to pick from
- Neutral, because it is less performant Python with sequential operation
- Bad, because it manages its own isolated environments and install packages
- Bad, because it can't apply fixes to staged files after pre-commit hook

### Husky

[Link to GitHub project](https://github.com/typicode/husky)

- Neutral, because it is ubiquitous in the NodeJS ecosystem
- Neutral, because doesn't provide simplified interface for concurrency
- Bad, because it requires a `package.json` as part of the NodeJS ecosystem
- Bad, because it requires additional tools to handle (partially) staged files and apply fixes

### Plain Scripts

Basically linking into `.git/hooks/` by hand.

- Good, because it adds zero dependencies
- Bad, because it requires to implement all features of a Git hook manager in the workflow orchestrator
