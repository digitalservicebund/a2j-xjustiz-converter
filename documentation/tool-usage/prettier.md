# Prettier

[Related Decision Record](../decision-records/0005-apply-prettier-formatting-to-non-application-code.md)

[Prettier](https://prettier.io) is our primary formatter for non application
files. This includes especially documentation in Markdown, as well as tool
configurations in JSON or YAML.

## Stick to Default Options

We deliberately stick to the sophisticated defaults by Prettier to avoid
bikeshedding. That also means there is no configuration file needed.
