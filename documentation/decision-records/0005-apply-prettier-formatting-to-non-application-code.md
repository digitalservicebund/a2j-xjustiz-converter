---
status: approved
date: 2026-04-24
---

# Use Prettier Formatting for Non Application Files

## Context and Problem Statement

As we mature our "Docs-as-Code" practices, our repository increasingly relies on
a variety of non-application files for documentation and configuration of tools.
This primarily focuses on universal filetypes like Markdown, JSON, and YAML.

Which formatting tool can we use for these non application files?

## Decision Drivers

- Supports a wide variety of relevant filetypes
- Opinionated defaults to avoid bikeshedding
- Works deterministically
- Idiomatic and well established

## Decision Outcome

Chosen option: **Prettier**, because it is the basically the industry standard
for formatting Markdown, JSON, and YAML. Its opinionated enough to avoid
bikeshedding. It can be easily integrated everywhere for consistency. It
cleanly isolates structural formatting from other responsibilities like linting
or spell checking. It is not the fastest formatter performance wise, but usually
that's no issue. The team has good experience with the tool.

It is an open topic how formatters will be applied and enforced for the repository.

### Consequences

- Good, because the majority of non application files will be cleanly formatted
- Good, because the quality of the documentation format increases and becomes uniform
- Good, because git diffs will usually be cleaner
- Neutral, not everyone might agree with every formatting rule
- Neutral, because it theoretically requires the NodeJS environment
