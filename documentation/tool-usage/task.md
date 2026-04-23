# Task

[Related Decision Record](../decision-records/0009-orchestrate-workflows-centrally-with-task.md)

[Task](https://github.com/go-task/task) (also called `go-task` or `Taskfile`) is
the central workflow orchestrator for the repository. It provides workflows that
can be used for local development, checking code into the version control
system, continuously integration pipelines, releases, and deployments. Running
static code analysis tools and scanner, executing tests, building applications,
generating artifacts, and publishing releases.

For example, fixing structurally format a single file in a code editor, fixing
the format of a list of staged files on the command-line, and verifying the
correct formatting of the whole codebase within a continuous integration
pipeline. The whole lifecycle.

Other infrastructure tools like git hook managers or continuous integration
services must use these workflows. In consequences they become more focused on
their core competencies. Workflows remain independent, can be run locally and
can be debugged straight forward.

In combination with the development environment, it creates strong cross machine
compatibilities - heavily reducing "works on my machine" scenarios.

## Usage

Task will be automatically available via the [development environment](./devbox.md)
and should be used in conjunction with it. Running `task --list` will provide
on overview of available tasks and their respective description to run. For
example: `task check:format`.

It is most convenient to use Task with autocompletion on the command-line,
because tasks can be discovered and run quicker. Therefore, Task provides the
`task --completion <some_shell>` command. Depending on the local developer
setup, this can be as trivial as sourcing it into the shell, for example like
`source <(task --completion zsh)`. There are also installable extensions for
popular code editors.

Some tasks and workflows support to provide a list of files as argument to limit
their radius of action, for example: `task fix -- README.md Taskfile.yml`. Task
should indicate in their description if they support files as argument.

Tasks should include their required setup automatically. So any workflow can be
called without implicit preconditions. For example, runtime dependencies will be
installed before an application is build. Exception is the development
environment itself. Updates to it will be detected and installed automatically,
but require to rerun the actual task to have updates taking effect. This can be
avoided by running `devbox run task ...`, as this will always ensure that the
environment is up to date first and then run Task in this environment.

From a technical perspective, everything in Task is a task. Workflows are a meta
concept, describing tasks that compose a bunch of other tasks.

## Task Taxonomy and Scopes

To maintain a predictable and self-documenting CLI experience, all tasks are
categorized and grouped into a hierarchy of scopes. Tasks are named by the chain
of scopes, for example `scope-a:scope-b:scope-c`. While `scope-b` is a sub-scope
of `scope-a` and `scope-c` is a sub-scope of `scope-b`. Practical examples would
be `check:format` or `fix:format`. Sometimes, the final scope is just the name
of the tool that is run in this task, like `check:format:prettier`. Each scope
can be run individually. So running `check` will run any sub-scope of it in
parallel. In turn `check:format` will only run all sub-scopes of itself again.
This are implicitly lightweight workflows.

The full task name should read as imperative commands, starting with a verb
followed by a noun like `check:format` or `fix:format`. Developers should be
able to guess the impact of a task based on the naming (e.g. read-only `check`
versus modifying `fix`). Tool names should be excluded or only used as last
the last scope if necessary to manage complexity. Such tasks should usually be
marked as `internal: true` to keep the list of tasks

The tiered hierarchy of scopes looks like the following:

**ensure:\***
Internal gatekeepers for prerequisites to _ensure_ the system meets the
requirements for a higher level task.
_Example_: `ensure:development-environment`

**setup:\***
Bootstrapping tasks, often downloading artifacts, that are cached to set up
the tooling or environment for a higher level task.
_Example_: `setup:vale`

**check:\***
Read-only validation by static analysis tools that fail on noncompliance,
reporting detected issues.
_Example:_ `check:format`

**fix:\***
Modifying files by fixing issues that can be automatically resolved.
_Example:_ `fix:format`

**test:\***
Running executable test suites to dynamically verify business logic, fitness
functions etc.
_Example:_ `test:end-to-end`

**build:\***
Assemble various kind of artifacts from source code via compilation, bundling, etc.
_Example_: `build:library`

**publish:\***
Distribute built artifacts, for example by publishing to a registry, often
requiring secrets or authentication tokens.
_Example:_ `publish:library`

**verify:**
High level composed workflows to verify staged changes or for continuous
integration pipelines.
_Example:_ `verify:staged-changes`

## Tasks Working on File Lists

Tasks that `check` or `fix` something should read list of files from
command-line arguments. The most trivial version to do so is by passing
something like `{{ .CLI_ARGS | default .ROOT_DIR }}` as argument to a tool,
when defining a task. For tools that require a file pattern, this could be
changed to `{{ .CLI_ARGS | default "**/*.ext" }}` as example.

When the tool depends on a list filtered by file extension, the following
pattern can be used:

```yaml
tasks:
  check:example:
    vars:
      FILES: '{{ .CLI_ARGS_LIST | join "\n" }}' # The advantage of CLI_ARGS_LIST versus CLI_ARGS is proper shell escape sequence parsing
      FILTERED_FILES: '{{ regexFindAll "(?m)^.*\\.ext$" .FILES -1 | join " " }}' # Go RE2 expression matching per line.
    if: "{{ empty .FILES | or (not (empty .FILTERED_FILES)) }}" # Skip if nothing left after filtering.
    cmd: example '{{ .FILTERED_FILES | default <some_default> }}'
```

Some tools are not capable to take all `.gitignore` files into account. In such
a case the global `.ALL_PROJECT_FILES` variable can be used. With a growing
codebase, we might run into character length restrictions for commands in
future. A possible fix will be to use `xargs` to resolve the limit.
