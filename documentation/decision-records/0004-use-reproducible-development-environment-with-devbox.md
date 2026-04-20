---
status: approved
date: 2026-04-23
---

# Use Reproducible Development Environment with Devbox

## Context and Problem Statement

Every repository requires tooling beyond what the programming language specific
package manager provides. Runtimes, compilers, debuggers, formatters, linters,
security scanners, task runners, git hook managers, and many more. But also
basic POSIX utilities (e.g. `grep`, `curl`, `sed`) are used in repositories.
There is a need to properly specify required tooling for development
environments.

This is a common inconvenience, especially for people new to the repository.
Traditionally, everything must be installed manually. In best case guided by
some maintained documentation. But despite that, it is also a source for
potential bugs. Developers use different versions of the same tool and update
inconsistently. Partially they are even restricted by their operation system
individual package manager, that provides only a specific range of versions for
a tool. Even related operation systems provide the same tool in different
variants. For example, taking UNIX based operation systems (e.g. Linux, macOS,
BSD) which inconsistently support command line arguments, a source of frequent
frustration. Usually, also the used continuous integration environment uses
a completely separate installation logic again.

Also, each repository might require different versions of the same tool being
installed. This is a common pain point for the language specific toolchain with
compiler and compatible package manager. Usually this is solved by development
platform specific version managers. However, this is a generic problem that
needs to be solved for the whole toolchain per repository.

Finally, reproducible development environments become more valuable in the
context of emerging cloud/remote development environments and AI agent
sandboxing.

We need a single, declarative definition of the complete tooling used in the
repository that applies everywhere. Which tool can we use to provide use with
a universal usable, reproducible development environment?

## Decision Drivers

- Reproducible toolchain with exact versions
- Consistency cross platforms (especially Linux and macOS)
- Local developer and continuous integration environments derive from the same source
- Good developer experience with low entry barrier
- Clear scope of responsibility between the different package managers

## Considered Options

- Devbox
- Flox
- devenv
- mise

## Decision Outcome

Chosen option: "Devbox", because it provides a straightforward interface,
similar to many other package managers. It is based on the strong Nix ecosystem,
but abstracts away the complexity nicely. Finally, it has a convenient
DevContainer integration, providing a valuable alternative way to make the
toolchain available. The team has already good experience with it.

It becomes mandatory to use within the continuous integration environment, but
stays optional for local developer environments.

The details for the scope, usage in continuous integration environments etc. can
be in the section with [more information](#more-information).

### Consequences

- Good, because it reduces the "works on my machine" factor
- Good, because shell scripts become more portable between operation systems
- Good, because new developers can onboard much faster
- Good, because DevContainers provide a cheap escape hatch to improve adoption rate
- Good, because the lockfile acts as documentation of the toolchain in worst case
- Neutral, because it is optional for the local developer
- Bad, because it requires a local Nix setup for direct shell integration without containers
- Bad, because it the toolchain can't be split into multiple layers (e.g. for CI)

### Confirmation

We'll need to monitor the scalability of a single environment without layers.
Especially in terms of cache size for continuous integration environments.

## Pros and Cons of the Options

### Devbox

- Good, because it provides a straightforward interface of a package manager
- Good, because it is based on the strong and extensive Nix ecosystem
- Good, because it has first class DevContainer support
- Good, because it uses a lockfile for caching and even just documentation
- Neutral, because it is an established solution for years
- Neutral, the team has already experience with it in multiple repositories
- Bad, because it doesn't support layering for individual local setups or continuous integration
- Bad, because it requires a local Nix setup for direct shell integration without containers

### Flox

- Good, because it provides a straightforward interface of a package manager
- Good, because it is based on the strong and extensive Nix ecosystem
- Good, because it supports layering of multiple environments
- Good, because it uses a lockfile for caching and even just documentation
- Neutral, because it can produce OCI images, not full DevContainer configuration
- Neutral, because it seems to push more for paid services
- Neutral, because it a young project
- Neutral, because the team has no experience with it yet
- Bad, because it requires a local Nix setup for direct shell integration without containers

Flox is an interesting candidate that we might wanna transition to in future.
When the project has fully matured and environment layering becomes more of an
urge.

### Devenv

- Good, because it is based on the strong and extensive Nix ecosystem
- Good, because it has first class DevContainer support
- Good, because it can be incredibly powerful, having the Nix programming language at hand
- Bad, because it does not allow for specifying tool individual versions
- Bad, because it has a steep learning curve, exposes more Nix internals, conflicts low adaption barrier
- Bad, because it requires a local Nix setup for everything

### Mise

- Good, because it uses a lockfile for caching and even just documentation
- Good, because it can be installed as single binary itself
- Neutral, it provides some basic DevContainer integration
- Bad, because it has much less desired packages with focus on development platforms
- Bad, because is doesn't include child dependencies (e.g. OpenSSL)
- Bad, because it doesn't use proper hashes to pin dependencies

## More Information

### Scope

There are at least three package managers involved in every local developer
setup by this: programming language specific package manager (e.g. `npm`,
`cargo`, `nuget`), development environment package manager (e.g. `devbox`,
`flox`, `mise`) and the underlying operation system with its respective package
manager capabilities (e.g. `apt`, `homebrew`, `snap`).

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

### CI Integration

The continuous integration pipeline must use the development environment as
foundational layer to execute from. This reduces the complexity and converges
the environments. The hash of the `devbox.lock` will act key of the cache for
the pipeline.

Not the whole development environment will be relevant for continuous
integration environment, or not all in the same workflow. For example, debuggers
or git hook manager. While this isn't harmful in first place, it will increase
the size of the cache for the development environment. Layered environments can
be a solution, if this should become an issue.

### DevContainers

Devbox provides a quick way to generate a DevContainer configuration. This
provides an alternative to set up the development environment without requiring
a Nix setup. It works especially well when used with a code editor that provides
direct integration locally. But also allows for various integration and usage
for cloud/remote development environments or as foundation for sandboxing.

### Dependency Updates

Just as other dependencies managed by other package managers, it is of high
advantage to automatically monitor for updates - especially for security
updates. Renovate is known to have support for Devbox. It must be evaluated if
Renovate can be used for the repository.
