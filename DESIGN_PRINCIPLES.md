# Design Principles

At the current point in time, this document consist of a loose collection of
principles per section. Many of them have their root in the
[decision-records](./documentation/decision-records/).

## Document-Driven Development

We believe in the strength and advantages of a documentation first approach.
Just "clean code" ain't enough. It is our goal to maintain a culture where
documentation feels natural. It should be low effort without the feel of
a burden. We treat documentation as code, version controlled inside the
repository with automated quality assurance. Documentation must be structured so
it creates a structure that supports progressive disclosure. See also the
decision records [0001](/documentation/decision-records/0000-use-decision-records.md)
and [0003](/documentation/decision-records/0003-use-document-driven-development.md)
for more details and conventions.

## Clarity over Brevity

We use full, not abbreviated words for a clear language. This applies to
everything we control, document, and name ourselves, including directory or
filenames, identifiers in code etc. The goal is to maintain a high level of
readability, reducing the cognitive load. Especially for everyone who is new to
the repository. Recognition is easier than recall. For example, we use
`documentation/decision-records` as path for our (architecture) decision records
which reads straight forwards, in contrast to for example `docs/adr`.
Abbreviations also collide over time, causing confusion. Documentation as well
as code is much more often read than written. For the latter, autocompletion
solve potential inconveniences.

However, this is a best effort. Some abbreviations are just so common, spelling
them out actually makes it harder to understand. We also don't fight ecosystem
conventions. For example like the `src/` directory. Deviating here increases the
cognitive load, reversing recognition to recall.

## German Domain Language

The domain language of the German justice system is German. It is the ubiquitous
language of the domain. Many administrative and legal terms lack precise English
equivalents, or carry specific legal meaning that gets lost or distorted in
translation. Deviating from the ubiquitous language causes issues between domain
experts and engineers, increases the cognitive overhead and leads to bugs.
Therefore, German is used directly for any terminology of the domain, embedded
in a technical frame of English code and documentation. See also [decision record 0002](./documentation/decision-records/0002-use-german-for-the-domain-and-english-for-technical-code.md)
fore more details and conventions.
