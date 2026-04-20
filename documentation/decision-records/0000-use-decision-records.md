---
status: accepted
date: 2026-04-20
---

# Use Decision Records

## Context and Problem Statement

Decisions are made constantly. The big important architectural decisions, but
also plenty of small ones for design choices, tooling, formatting, etc. Yet the
reasoning and the original context behind them fades quickly. Documenting
decisions enables to take informed decisions, helps onboarding, prevents
unintentional reversals. Decision records make relevant information
discoverable, something probably even more important with rise of AI.

We want to establish a culture where documenting decisions feels natural and
low effort rather than like an obligation. Lightweight (architecture) decision
records should encourage to file decision records that just capture enough
context to make a decision understandable in hindsight. However, decisions with
rather big impact might deserve more extensive documentation, potentially
informed by preceding research.

Which format and conventions should we use for capturing decisions?

## Decision Drivers

- Documentation should feel lightweight - minimal records are better than none
- Decisions should be version-controlled and close to the codebase (doc-as-code)
- Markdown as markup language: commonly used, good to read, can be linted, HTML convertible
- The repository should establish conventions around full, readable names and low cognitive load

## Considered Options

- [MADR](#madr) (Markdown Architectural Decision Records)
- [Nygard's original template](#nygards-original-template)

## Decision Outcome

Chosen option: "MADR", because it is actively maintained and sees broad
community adoption. It strikes a good balance between structure and brevity.
Metadata sits at the top in YAML format. Only the `status` field is required.
The body stays flexible, explicitly supporting stripping optional sections.

The exact conventions about the exact application are described in all detail
within the section for [more information](#more-information).

### Consequences

- Good, because every significant decision gets a traceable, version-controlled record close to the codebase
- Good, because new team members can understand past decisions and their rationale
- Good, because the barrier should be low enough to encourage more decisions becoming documented
- Neutral, because MADR is slightly more structured, which could feel like overhead if not stripped

## Pros and Cons of the Options

### MADR

[Markdown Architectural Decision Records](https://github.com/adr/madr) provides full and minimal templates with
complementing documentation.

- Good, because it includes explicit status and metadata in YAML front matter
- Good, because it explicitly supports a minimal stripped down version
- Good, because it offers more detailed structure for decisions that need it
- Good, because the project is actively maintained and sees community adoption
- Neutral, because it is a much larger template that requires stripping

### Nygard's Original Template

The [original template](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) as a blog post by Michael Nygard from 2011.

- Good, because it is probably the most referenced template
- Good, because it is straight forward and short
- Bad, because it lacks explicit, structured metadata
- Bad, because it doesn't provide structure for detailed decisions
- Neutral, because it feels slightly dates, though perfectly functional

## More Information

### Directory and File Naming

Decision records live as a list plain Markdown files within the
`documentation/decision-records` directory. We deliberately use full words for
clarity and low cognitive load.

Decision records are numbered sequentially, used as prefix within the filename.
A four-digit zero padded number is the common practice. It creates a natural
history view inside the directory of decision records when sorted ascending. The
title of the decision record in lower-kebab-case is then supplemented to the
number to compose the full filename.
Example: `0097-title-of-a-decision.md`

A copy of the full MADR template is provided along the decision records as
`template.md`. It can be copied and stripped down for each new record.

### Statuses

A decision record must carry one of the following statuses in its YAML front matter:

- `proposed` — open for discussion, kept until related pull request gets merged
- `accepted` — agreed upon and in effect, set when merging related pull request
- `deprecated` — no longer relevant but kept for historical context
- `superseded` — replaced by new decision with explicit link using the number as display content

There is intentionally no status to represent a declined decision. Such records
might still be discoverable at the public repository hosting service as closed
pull request.

### Process

1. Copy the `template.md` file with the next sequential number and matching title.
2. Fill in the sections, while stripping optional sections freely.
3. Open a pull request with status `proposed` and assign reviewers.
4. Once the decision is `accepted`, change the status accordingly and merge the pull request.

Decision records might just capture the result of discussions in internal
meetings or workshops. In such a case, the record can be committed directly with
the `accepted` status.

We do not prescribe specific tooling. Team members may use them locally by
preference. Linting for decision records will be introduced once the repository
has the infrastructure for it (e.g. CI pipeline, Git hooks)

### Research Documents

For larger decisions or such with high impact, an initial research phase may
have preceded the decision itself. In such a case, it should be filed as
separate document to provide further context and details. Similar to decision
records, they might be filed in by requesting for comments via a pull request.
Decision records that are based on some research must link to the related
document, to make it easier to discover.

All research documents live relative to the decision records inside the
`documentation/decision-records/research` directory. They don't follow a strict
template and can be much more informal.

### README

A `README.md` in the `documentation/decision-records` directory acts as minimal
entry point. It basically provides condensed version of this decision record
here. It must not contain a formatted list of all decision records. The plain
list of files in the directory acts as table of contents. It can't get
out-of-date and the filename convention provides enough information. The README
itself, in combination with the filesystem, including the research directory,
act as simplified source for progressive disclosure, also for agents.
