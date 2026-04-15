---
<<<<<<< HEAD
<<<<<<< HEAD
status: approved
date: 2026-04-23
=======
status: proposed
date: 2026-04-15
>>>>>>> 83c191a (docs: submit decision record to use documentation driven development)
=======
status: proposed
date: 2026-04-15
>>>>>>> 83c191a (docs: submit decision record to use documentation driven development)
---

# Use Documentation-Driven Development

## Context and Problem Statement

The codebase will evolve over time and team members will rotate eventually.
Decisions, design rationale, and conventions risk being lost if not captured. We
want to establish a documentation strategy that serves humans first and AI
agents as a side effect. We also want to avoid both extremes: no documentation,
hoping just "clean code" is enough, and excessive documentation that nobody
maintains.

How should we structure documentation in this repository so that it captures the
important conventions, remains maintainable, and is discoverable by both humans
and agents?

## Decision Outcome

Chosen option: "document-driven inspired development", because we wanna embrace
documentation as driver, not as an afterthought. We apply this to all aspects of
the repository, not just product development. We use established documentation
practices to make them easily discoverable and accessible. The documentation
must be structured so that progressive disclosure becomes possible.

For the product development aspect specifically, we use related patterns like
README-driven development, API-First and similar. They should be used as driver
for developer research, fostering the X-as-a-service interaction mode to the
other teams.

We treat documentation as code. Documentation lives in the repository, is
version-controlled, reviewed alongside code changes, and automated quality
checks are applied (e.g. formatting, linting, spell checking, link validation)
just as for the source code.

The exact conventions with extra details are within the section for [more
information](#more-information).

### Consequences

- Good, because decisions and conventions are captured and discoverable
- Good, because human documentation automatically serves AI agents
- Good, because established conventions are easily recognizable by new team members and open source community
- Good, because progressive disclosure keeps documentation navigable while it grows
- Bad, because maintaining documentation requires ongoing discipline from the team.
- Bad, because automated documentation checks add complexity and occasional false positives

## More Information

In general, documentation is expected primarily to live within the
[documentation](../documentation/) directory. We already [use decision records](./0000-use-decision-records.md).
In addition, the following conventional files are in the root of the repository:

- `README.md` acts as overall entry point, provides basic context and links to further documentation
- `CONTRIBUTING.md` describes how we work, the basic structure, how to get started with the repository etc.
- `ARCHITECTURE.md` acts as entry point for architecture documentation, provides rough overview and links to diagrams and decision records
- `DESIGN_PRINCIPLES.md` describes how we think, design approaches, conventions, test strategy etc.
- `GLOSSARY.md` acts as entry point to our ubiquitous language of the domain
- `SECURITY.md` and `CODE_OF_CONDUCT` follow organizational defaults for now

Each file should only be created once we have actual content. We want to avoid
zombie documentation or placeholder files. However, each listed documentation
file is expected to be filled with content soon.

The documentation files in the root act as easy to discover entry point will
established naming and convention. However, their content size must be
monitored. Too long documents loose value, because it becomes harder to find
information, humans feel annoyed, and AI agents get overwhelmed by costly
context. Therefore, relevant directories should be created within the
repositories `documentation` and content will be split into multiple files, once
necessary. The root documentation files will become rather short entry points
that link to the respective directory, making it easily discoverable.

We treat directories as tables of contents. We do not maintain curated lists of
links to documents. The filesystem is the authoritative index. Documents link to
directories for discovery and to specific files only as inline cross-references.
README files can be added to a directory to provide context and guidance.

We use verbose, not abbreviated directory names for readability, reduce
cognitive load and improve discoverability (e.g. `documentation/` instead of
`docs/`). Though, we conform to conventions by the ecosystem where deviating has
high costs and actually increases cognitive load (e.g. `src/`).

To bootstrap the progressive disclosure for AI agents, files like `AGENTS.md`
will be added. These should contain no content but referencing to the README in
the root directory of the repository that acts as universal entry point.
