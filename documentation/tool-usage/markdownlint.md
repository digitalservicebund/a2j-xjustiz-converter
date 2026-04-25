# Markdownlint

[Related Decision Record](../decision-records/0006-lint-markdown-files-with-markdownlint.md)

[Markdownlint](https://github.com/DavidAnson/markdownlint) is used to
semantically validate Markdown files, primarily for documentation.

## Stick to Default Options

We deliberately stick to the sophisticate defaults by Markdownlint to avoid
bikeshedding. That said, there are some exceptions which unfortunately can't be
commented in the JSON configuration file (use git blame and history for
details). To become compatible with the structural formatting by Prettier.

## Which Command-Line Interface to Use

Markdownlint itself actually provides no command-line interface by itself.
Historically, multiple such interfaces have been implemented. Finally, the
author of Markdownlint itself provided an implementation itself, called
`markdownlint-cli2`.

## Single Configuration File

The `markdownlint-cli2` tool provides the `config` property to define the
Markdownlint configuration within its [configuration file](../../.markdownlint-cli2.yaml).
We avoid having splitting the configuration into two files, to reduce the
clutter in the root directory of the repository.
