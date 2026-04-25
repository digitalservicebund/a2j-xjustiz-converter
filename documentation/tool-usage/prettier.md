# Prettier

[Related Decision Record](../decision-records/0005-apply-prettier-formatting-to-non-application-code.md)

[Prettier](https://prettier.io) is our primary formatter for non application
files. This includes especially documentation in Markdown, as well as tool
configurations in JSON or YAML.

## Stick to Default Options

We deliberately stick to the sophisticated defaults by Prettier to avoid
bikeshedding. That also means there is no configuration file needed.

## Issues with Ignore Files

Prettier has a known issue of properly taking into account all `.gitignore`
files in a repository. Per default, it only takes the ignore-file in the working
directory into account. Theoretically it is possible to define more files using
the `--ignore-path` command-line argument. However, Prettier interprets the
patterns in these files as if they were in the working directory. Which is
incorrect and in turn doesn't work. Thereby, it is not possible to have Prettier
discover files itself, without working on ignored files. To get around that, an
explicit list of files must be passed (for example via `git ls-files`).
