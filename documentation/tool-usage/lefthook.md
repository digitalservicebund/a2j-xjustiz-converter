# Lefthook

[Related Decision Record](../decision-records/0010-use-git-hooks-with-lefthook.md)

[Lefthook](https://github.com/evilmartians/lefthook) is the Git hook manager
that automatically runs on Git events like when committing changes or pushing to
a remove. It runs dedicated tasks from the [workflow orchestrator](./task.md).

## Setup

Lefthook will automatically be set up on the local machine when having run
`task setup` initially.

## Usage

We intentionally reduce the complexity of the Lefthook set up, having it focus
on the core capabilities of bridging between Git events to hook the respective
workflows. Thereby, we don't use globs, jobs, scripts, or similar options and
features. Each relevant event by the version control system has a related
workflow.

## Developer Local configuration

Lefthook provides the feature to have additional local configurations. To do so,
add a `lefthook-local.yaml` configuration file and ignore it by appending it to
`.git/info/exclude`. Check out [the documentation](https://lefthook.dev/examples/lefthook-local/).
The intention should not be to `skip` commands of the shared configuration.
