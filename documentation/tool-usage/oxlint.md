# Oxlint

[Related Decision Record](../decision-records/0013-lint-typescript-files-with-oxlint.md)

[Oxlint](https://github.com/oxc-project/oxc) is used to semantically validate TypeScript files.

## Use Through Task

Oxlint is wired into `task check:lint` and `task fix:lint`. The internal leaf tasks `check:lint:typescript` and `fix:lint:typescript` keep the public task surface aligned with the repository task taxonomy.

## Let Oxlint Discover Files

For repository-wide runs, Task invokes Oxlint on `.` and lets Oxlint discover matching files. When a file list is provided on the command-line, Task only routes the TypeScript linting task when the list contains `.ts` or `.tsx` files.

To prevent errors when no matching files are found, the `--no-error-on-unmatched-pattern` flag is added to Oxlint commands. This flag may need to be removed once TypeScript files are added to the repository.

## Keep the Initialized Defaults

The repository contains a root [`.oxlintrc.json`](../../.oxlintrc.json), initialized from Oxlint defaults. It currently enables the `typescript`, `unicorn`, and `oxc` plugins and sets the `correctness` category to `error`. There are no custom rule overrides yet.

## Apply Fixes Explicitly

The fix task currently runs Oxlint with `--fix` and `--fix-suggestions`. This keeps the full automatic fix behavior behind `task fix:lint`, while `task check:lint` stays read-only.
