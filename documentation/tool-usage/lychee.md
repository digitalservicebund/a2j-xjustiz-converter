# Lychee

[Related Decision Record](../decision-records/0008-check-link-validity-with-lychee.md)

[Lychee](https://github.com/lycheeverse/lychee) is used to find and verify links
in the codebase. This includes externals links like for websites, but also
internals or local links, often used between documents for documentation.

## Caching

Lychee is blazing fast, however we still use a cache that is valid for 1 day.
This also helps to reduce the limits on external sources. This does not apply to
local links, for example within documentation files.

The cache should be included in the cache of the continuous integration
environment too.

## No Ignore File

Lychee supports the usage of a typical ignore file (`.lycheeignore`). However,
to avoid cluttering the root directory of the repository too much, we maintain
a list of `exclude`d links within the [configuration file](../../lychee.toml) directly.
