# Devbox

[Related Decision Record](../decision-records/0004-use-reproducible-development-environment-with-devbox.md)

[Devbox](https://github.com/jetify-com/devbox) is used as package manager for
the reproducible development environment of the repository, providing the whole
toolchain from runtime, development environment, debuggers, linters, formatters,
security scanners, git hook manager, task orchestrator, POSIX utilities and
more. Check out the [section for development
environment](../../CONTRIBUTING.md#development-environment) for setup and usage
guidance.

## Usage

The environment can be set up for local development in two ways: either directly
in the shell or inside a container, offering DevContainer integration. The tools
and related setup are only available from within the development environment.

### In the Shell

This requires to have a local Nix setup. The recommended way is to use
the universal [nix-installer](https://github.com/DeterminateSystems/nix-installer).
Notice that Nix is not a single binary but has a substantial footprint onto your
system. However, it is highly recommended.

For single shot execution, the `devbox run <something>` command can be used. It
will automatically install everything and run the given command inside an up to
date environment.

As alternative, there are multiple ways to enter or active the development
environment on the command-line. The quickest approach is to run `devbox shell`
to start a child session in the current shell with the environment activated.
Alternatively for more control, `devbox generate direnv` provides a `.envrc`
file that could be automatically sourced, to make the environment available in
the current shell session. For both cases, you probably wanna use a setup that
automatically activates the environment when entering the repository.

Manually installing all packages based on the latest `devbox.json` (and
`devbox.lock`) can be done by running the `devbox install` command.

### DevContainer

Devbox can generate the full DevContainer configuration by running `devbox
generate devcontainer` and your DevContainer tooling takes it from there.

This approach avoids the need of a local Nix setup and instead relies on
container virtualization. DevContainers provide a well defined interface on top
of containers to allow for better integration in code editors. This approach
requires everything to run inside the container and does not allow merging the
development environment with the local shell setup.

## Scope

The development environment fills the gap between the programming language
specific package manager (e.g. `npm`, `cargo`, `nuget`) and the operation system
with its respective package manager capabilities (e.g. `apt`, `homebrew`,
`snap`).

The programming language specific package manager is responsible to install
application level dependencies that are used for compilation or running inside
tests. However, there is the exception of tooling that uses a plugin mechanisms
that is directly tight to the package manager. This is common for the NodeJS
platform, for example with ESLint or Vite. Such should not be installed into the
development environment because else won't work properly then.

The package manager development environment is responsible for every tooling
that is used inside the repository. That includes for example the language
specific package manager itself, including the development platform with
compilers and runtime. It also maintains the full list of quality assurance
tools like debuggers, linters, formatters, scanning tools, task orchestrators,
git hook managers and much more. This includes tooling used inside the
continuous integration pipelines. Furthermore, it is responsibly to maintain
a full list of used GNU core utilities (e.g. `coreutils`, `gnugrep`, `gnused`)
to establish operability and to allow better readable long flag arguments in
scripts (e.g. `--in-place`, `--extended-regexp`, `--verbose`).

The operation system and its package manager is responsible for everything left.
However, this should be a minimal set that requires documentation. Usually this
includes tooling requires operation system privileges like container runtimes.
The shell to interpret commands is for now also in this scope, but it up for
discussion as common source of frustration.

## Use Exact Versions

Instead of adding packages with an implicit "latest" version, specify an exact
version. Like instead of `devbox add git`, do `devbox add git@2.53.0` instead
(or edit the `devbox.json` file directly). While the `devbox.lock` file
theoretically captures the exact version per hash, it is less explicit and more
volatile. First of all, the `devbox.json` file also acts as some kind of
abstract documentation of the required tools and their versions. Furthermore,
having versions in place makes updates more explicit and visible. It also allows
for better detection of version updates by external tooling like Renovate.

## Don't Use Shell Scripts

We deliberately don't Devbox is capability to define shell scripts. These script
are basically just alias definitions. We rather use a proper task orchestrator
for this and have Devbox focus on its core responsibility.

## Don't Use Services

Devbox also provides the feature of defining services inside the development
environment. We currently don't use this feature and it is unclear if it is
actually desirable to do so. When local services become a need, we should
probably evaluate the requirements and solution space, as Devbox might not be
the most sophisticated solution here.

## Don't Commit DevContainer Configuration

We currently deliberately don't commit the DevContainer configuration as we
treat it as generated output that doesn't belong into the source repository.
Instead, it can be generated by everyone locally using `devbox generate
devcontainer` and ignored locally by adding `.devcontainer/` to
`.git/info/exclude`.
