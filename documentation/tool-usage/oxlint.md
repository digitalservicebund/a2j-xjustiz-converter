# Oxlint

[Related Decision Record](../decision-records/0013-lint-typescript-files-with-oxlint.md)

[Oxlint](https://github.com/oxc-project/oxc) is used to semantically validate TypeScript files.

## Use Through Task

Oxlint is wired into `task check:lint` and `task fix:lint`. The internal leaf tasks `check:lint:typescript` and `fix:lint:typescript` keep the public task surface aligned with the repository task taxonomy.

## Configuration as JSON Not TypeScript

Oxlint supports plain JSON files for configuration. It also supports the common
approach of having a `*.config.ts` file, using an ECMAScript with TypeScript.
Because we install Oxlint via our reproducible development environment, we must
use JSON. The TypeScript version is only properly supported when installed as
NodeJS module for a package.

We use JSON with comments (`.jsonc` file ending) to allow documenting minor
decisions. For example why certain rules are turned off or changed from their
default configuration options.

## Let Oxlint Discover Files

For repository-wide runs, Task invokes Oxlint on `.` and lets Oxlint discover matching files. When a file list is provided on the command-line, Task only routes the TypeScript linting task when the list contains `.ts` or `.tsx` files.

To prevent errors when no matching files are found, the `--no-error-on-unmatched-pattern` flag is added to Oxlint commands. This flag may need to be removed once TypeScript files are added to the repository.

## Stick with Defaults

We aim to stick with the sensible default configuration for all rules by the
public community where possible. Deviations should be done for good reasons
only, which must be documented in the configuration file itself.

## Apply Fixes Explicitly

The fix task currently runs Oxlint with `--fix` and `--fix-suggestions`. This keeps the full automatic fix behavior behind `task fix:lint`, while `task check:lint` stays read-only.
