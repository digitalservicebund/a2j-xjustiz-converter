# Contributing

This document describes how we work, the basic structure and how to get started
with the repository.

## Getting Started

The following sections provide guidance on how to set up the repository for
local development.

### Development Environment

The repository provides a reproducible development environment using
[Devbox](https://github.com/jetify-com/devbox). This includes the whole toolchain
that is used in the repository, including the runtime, development platform,
linters, formatters, security scanners, git hook manager etc. Check out the
[related decision record](/documentation/decision-records/0004-use-reproducible-development-environment-with-devbox.md)
for more details.

The environment can be set up for local development in two ways: either directly
in the shell or inside a container, offering DevContainer integration.

#### In the Shell

This requires to have a local Nix setup. The recommended way is to use
the universal [nix-installer](https://github.com/DeterminateSystems/nix-installer).
Notice that Nix is not a single binary but has a substantial footprint onto your
system. However, it is highly recommended.

The development environment can be activated in multiple ways. The simplest
approach is to run `devbox shell` to start a child session in the current shell
with the environment activated. Alternatively for more control, `devbox generate
direnv` provides a `.envrc` file that could be automatically sourced, to make
the environment available in the current shell session. For both cases, you
probably wanna use a setup that automatically activates the environment when
entering the repository.

#### DevContainer

Devbox can generate the full DevContainer configuration by running `devbox
generate devcontainer` and your DevContainer setup takes it from there.

This approach avoids the need of a local Nix setup and instead relies on
container virtualization. DevContainers provide a well defined interface on top
of containers to allow for better integration in code editors. This approach
requires everything to run inside the container and does not allow merging the
development environment with the local shell setup.
