# Contributing

This document describes how we work, the basic structure and how to get started
with the repository.

## Getting Started

```bash
$ devbox run task setup
$ devbox run task --list
task: Available tasks for this project:
  # setup, check, fix, test, build, ...
```

The repository provides a reproducible development environment using Devbox.
Follow the [instructions](./documentation/tool-usage/devbox.md) to set up and
learn how to use it. In addition, the repository features a [central workflow
orchestrator](./documentation/tool-usage/task.md) called Task. It acts as
primary interface for developers and related infrastructure. The `setup` task
takes care of various minor chores, like setting up Git hooks, downloading
3rd party plugins, etc. to get started. Tasks with specific dependencies will
automatically ensure they are set up.
