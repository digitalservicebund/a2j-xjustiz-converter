---
status: proposed
date: 2026-05-15
---

# Lint TypeScript Files with Oxlint

## Context and Problem Statement

We need to decide which linting tool should be adopted for TypeScript files in the project.

The project is developed as a greenfield library for the A2J Platform team. The A2J Platform team already uses Oxlint in their workflows and CI pipelines. We want to balance:

- developer productivity
- consistency across teams
- performance in local development and CI

## Decision Drivers

- Alignment with tooling already used by the A2J Platform team
- Fast feedback cycles in CI and local development
- Simplicity of the tooling setup

## Considered Options

- ESLint
- Biome
- Oxlint

## Decision Outcome

Chosen option: "Oxlint" because it offers the best balance between performance, flexibility, and alignment with the existing A2J Platform team tooling.

Biome was also considered because of its integrated formatter and overall developer experience. However, since this project already decides Prettier, the built-in formatter adds less value for us.

ESLint is the most mature option, but it does not provide the performance and workflow improvements that motivated this evaluation.

### Positive Consequences

- Good, because it enables faster local linting and CI execution compared to ESLint-only setups
- Good, because it aligns with tooling already used by the A2J Platform team
- Good, because it includes core ESLint and TypeScript linting support through built-in plugins
- Neutral, because custom ESLint plugin support is still marked as alpha

## Pros and Cons of the Options

### ESLint

ESLint is the long-established standard JavaScript and TypeScript linter with the largest ecosystem and plugin support.

[Link to GitHub project](https://github.com/eslint/eslint)

- Good, because it has mature ecosystem
- Good, because it has large community and long-term ecosystem stability
- Bad, because it is slower than Rust-based alternatives on large codebases
- Bad, because it does not align with the A2J Platform team’s existing Oxlint usage

### Biome

Biome is a Rust-based formatter and linter that combines formatting and linting into a single tool.

[Link to GitHub project](https://github.com/biomejs/biome)

- Good, because it runs fast
- Neutral, because it does not run ESLint plugin
- Neutral, because it has built-in formatter
- Bad, because it has limited ESLint plugin compatibility
- Bad, because it is less aligned with the A2J Platform team’s current tooling

### Oxlint

Oxlint is a Rust-based linter focused on ESLint compatibility and high performance.

[Link to GitHub project](https://github.com/oxc-project/oxc)

- Good, because it runs faster than Biome ([Link to Benchmark](https://github.com/oxc-project/bench-linter))
- Good, because it has strong focus on ESLint ecosystem compatibility
- Good, because it supports many ESLint plugins through its JavaScript plugin system
- Good, because it aligns with the A2J Platform team tooling
- Neutral, because its JavaScript plugin support is still marked as alpha
