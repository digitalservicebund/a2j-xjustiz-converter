---
status: approved
date: 2026-04-24
---

# Lint Markdown Files with Markdownlint

## Context and Problem Statement

As we mature our "Docs-as-Code" practices, our repository increasingly includes
Markdown files to write documentation. While we use structural formatting, we
also need semantic validation. This helps to prevent issues like wrong heading
levels, link syntax, etc.

Which linting tool can we use to lint our Markdown files?

## Decision Drivers

- Semantic integrity to make documents more usable
- Compatibility with Markdown formatting using Prettier
- Basic accessibility checks
- Idiomatic and well established

## Decision Outcome

Chosen option: "Markdownlint", because is basically the industry standard. It
provides a sensible set of default rules that is widely adopted. It provides
enough flexibility and has a large tooling ecosystem.

We will need to tune a small set of rules to become compatible with Prettier formatting.

It is an open topic how linter will be applied and enforced for the repository.

### Consequences

- Good, because the quality of our documentation increases semantically
- Good, because it allows for future extends to enforce custom conventions
- Neutral, because it require some configuration to be Prettier compatible
