---
status: approved
date: 2026-04-24
---

# Check Technical Style and Spelling for Prose with Vale

## Context and Problem Statement

For our "Docs-as-code" practices, we build up a toolchain for automated quality
assurance. We already check for structural formatting and validate Markdown
semantics. Moving forward, we wanna improve our technical style and enforce
consistency over time across the whole codebase. Also, checking our spelling and
grammar is important for high quality documentation.

What tool can we use to apply automated checks for consistent technical style
and correct spelling without typos?

## Decision Drivers

- Capability to enforce technical style consistently
- Capability to check spelling
- Code aware extraction of prose content in comments
- Handling of German domain language in English context
- Data privacy for local and office evaluation

## Decision Outcome

Chosen option: "Vale", because it provides packages for strong technical style,
supports setups for bilingual spellchecking and runs offline. It is highly
extendable with rules using plain configuration files, that allows us to
enforce our own style additions. Vale supports to lint to comments in code
as well. Furthermore, it supports for metrics to monitor the readability, like
the Coleman–Liau index.

Vale provides a list of so called packages that provide shared styles by the
community. There are packages for all purpose English prose, catching
insensitive or inconsiderate writing and common readability measures.
Furthermore, it offers implementations for popular technical style guides like
from Google or Microsoft. The exact choice of styles can be found in the section
with [more information](#more-information).

Vale also supports to validate YAML frontmatter, which we use for our decision
records and likely more documentation files in future. The concept of views
allows for the creation of powerful rule processing.

There are integrations for all code editors for instant feedback while writing
documentation. Popular editors are provided with plugins. Furthermore, there is
a first party language server implementation available as well.

It is an open topic how linters will be applied and enforced for the repository.

### Consequences

- Good, because the quality of our documentation increases
- Good, because we can enforce custom rules, like for our decision record template
- Good, because we can properly maintain our domain terminology with strong checks
- Good, because it allows us to enforce our own language preferences
- Neutral, because German spelling requires a manual setup
- Neutral, because applying all styles will require fixing our existing documentation
- Bad, because the rules can become annoying to adhere while writing

### Confirmation

We will learn over time which styles actually improve our documentation quality
and which just create friction for subjectively too strict rules. We will
disable rules where they conflict with our own ones.

## More Information

### Style Packages

As foundation, we use Vale it's internal style for basic spellchecking and to
enforce our domain terminology. In addition we use `proselint` for overall
better prose and `alex` for inclusive language.

For the future we consider the following style packages, but won't apply them yet,

For a strong technical style we consider to use the widely adopted the _Google
Developer Documentation Style Guide_. It is focused on technical documentation
with short, dry, and effective structure with an active voice. In contrast, the
also popular _Microsoft Writing Style Guide_ focuses more on user facing
documentation for a nontechnical audience.

Furthermore, we consider to `Readability` package with its metrics.

Finally, we will add our own default package to enforce our preferences. For
example, to add a set of rules to enforce the structure of our decision record
template.
