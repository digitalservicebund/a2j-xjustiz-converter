---
status: proposed
date: 2026-04-21
---

# Orchestrate Workflows Centrally with Task

## Context and Problem Statement

The codebase in a repository requires various tasks to run in different
compositions. From local development, over checking into the version control
system, to continuously integration pipelines with final releases. Running
static code analysis tools and scanners, executing tests, building bundles,
generating artifacts, and publishing releases.

The same tasks repeat in different variations in diverse conditions in the
individual lifecycle phases. For example, fixing the structural formatting of
a single file in a code editor, doing the same for a list of staged files on
the command-line, and verifying the formatting of the whole codebase within
a continuous integration pipeline.

Often, this logic is split across multiple locations. Almost identical tasks are
defined in package manager scripts, git hook manager setups, continuous
integration workflows and shell scripts. Complemented by individual code editor
extensions. A centralized workflow orchestrator pulls out the shared logic into
reusable tasks. This reduces the complexity in the surrounding infrastructure
without the need for powerful task runner capabilities, making them focus on
their core responsibility. For example, a git hook manager maintains the
integration with the version control system, providing a clean staging
environment to run tasks in. Or a continuous integration environment provides
the triggers, caching, secret injection, remote computation resources and so on.

The central orchestrator becomes the main entry point for working with the
repository. It reduces documentation overhead by self documenting tasks and
workflows that are discoverable, also by AI agents.

A centralized workflow orchestrator also has the advantage of a more direct
integration with the reproducible development environment. In combination, it
highly improves the ability to run, test, and debug workflows locally. The
frustrating scenario of hard to debug continuous integration workflows heavily
reduces to minimal environment specifics only. Furthermore, it can contribute to
a higher compatibility across machines.

Moreover, such a centralized workflow orchestrator also reduces the dependency
to platform specific infrastructure services, like certain continuous
integration environments. It makes the workflows much more portable.

## Decision Drivers

- Portability to run exactly the same inside all relevant environments
- Support to process directed acyclic graphs to resolve task trees for efficiency
- Function like composition of tasks with arguments, e.g. to pass and filter lists of files
- Idempotent task execution with caching to support defining full workflows that are able to skip unnecessary work
- Awareness and integration with the development environment of the repository
- Intuitive interface for great developer experience to discover workflows and tasks

## Considered Options

- Task
- Just
- GNU Make

## Decision Outcome

Chosen option: "Task", because it is "just" a task runner, but with plenty of
powerful features to provide the full package. It uses plain YAML files with Go
templating that can be linted by schema. With Task it is possible to define
complex dependency graphs with arguments and smart caching. It supports loops,
matrices, lazy evaluation and deferring of clean up tasks. The internal
shell interpreter provides improved cross machine compatibility. Finally,
a short `task --list` acts as perfect starting point for new contributors as
well as AI agents.

### Positive Consequences

- Good, because we have universal workflows and tasks defined once across the full lifecycle
- Good, because the developer experience increases
- Good, because continuous integration pipelines and git hooks become plain triggers
- Good, because a neutral shell interpreter improve cross machine compatibility
- Good, because workflows can be tested and debugged locally
- Good, because we can include setup logic that only runs when necessary
- Good, because the codebase becomes more accessible for AI agents
- Neutral, because contributors might not be used to a centralized workflow orchestrator
- Neutral, because contributors must learn to define workflows with Task

## Pros and Cons of the Options

### Task

[Task](https://github.com/go-task/task), sometimes referred to as `go-task` or
`Taskfile` (which actually is the configuration) to resolve the ambiguous
naming issue.

- Good, because first class caching and dynamic validation of task relevance
- Good, because it provides enough power to implement function like composition with arguments
- Good, because it has an internal shell interpreter to improve cross machine compatibility
- Good, because it provides powerful Go templating in plain YAML that can be linted
- Good, because it supports loops, matrices, and deferred tasks
- Good, because tasks can be properly described for users
- Good, because it provides a command-line interface with smart autocompletion
- Bad, because of YAML fatigue, similar to the Cloud Native Computation ecosystem

### Just

[Just](https://github.com/casey/just), sometimes called `Justfile` (which is
actually the configuration) to resolve the ambiguous naming issue.

- Good, because tasks can be described for users
- Neutral, because it is basically a simplified version of Make with raw shell scripts
- Bad, because it depends on the hosting shell to execute commands
- Bad, because it has no caching mechanisms and advanced directed acyclic graph resolution
- Bad, because it uses a custom syntax for the configuration

### GNU Make

- Good, because it is ubiquitously on almost any POSIX system
- Good, because it provides file based caching
- Neutral, because it is designed as a build tool
- Neutral, because it is almost pure shell scripting but always a bit different
- Bad, because it is not meant to be used as task runner or workflow orchestrator
- Bad, because it depends on the shell of the local machine
- Bad, because it interprets line by line, making longer scripts hard to write
- Bad, because tasks can't be properly described
- Bad, because the command-line interface is not nice for the job
