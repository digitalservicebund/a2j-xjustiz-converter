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
decision records [0001](./documentation/decision-records/0000-use-decision-records.md)
and [0003](./documentation/decision-records/0003-use-document-driven-development.md)
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
them out actually makes it difficult to understand. We also don't resist
ecosystem conventions. For example like the `src/` directory. Deviating here
increases the cognitive load, reversing recognition to recall.

## German Domain Language

The domain language of the German justice system is German. It is the ubiquitous
language of the domain. Many administrative and legal terms lack precise English
equivalents, or carry specific legal meaning that gets lost or distorted in
translation. Deviating from the ubiquitous language causes issues between domain
experts and engineers, increases the cognitive overhead and leads to bugs.
Therefore, German is used directly for any terminology of the domain, embedded
in a technical frame of English code and documentation. See also [decision record 0002](./documentation/decision-records/0002-use-german-for-the-domain-and-english-for-technical-code.md)
for more details and conventions.

## Type-Driven Development

We use the type system to express intent. Domain concepts, constraints, and
invariants are encoded into the type system wherever the compiler can enforce
them. A type that makes an invalid state irrepresentable is worth more than
a runtime check that catches it after the fact, requiring error handling where
none should be required. And where must, we prefer the "parse don't validate"
principle.

We prefer compile-time guarantees over runtime checks. Everything the compiler
can evaluate, verify, or decline is a win: a class of bugs that cannot exist,
a test that does not need to be written, a constraint that cannot be forgotten.
This is not about fighting the type system. It is about being complete
— expressing in code what we already know to be true about the domain.

## Descriptive Type Errors

When a generic conditional TypeScript type receives an invalid argument or runs
into an invalid branch, it is common to resolve to the `never` type. The `never`
type doesn't match anywhere, so it successfully pops up as type error somewhere.
However, a plain `never` doesn't carry any information what the actual problem
is.

Instead, descriptive type errors can provide extra information, displayed to the
developer. To work reliable, the error case should distinctively resolve to
a different type than any successful case. This is best done with an actual
`TypeError`, complemented by a string literal as message. This communicates
quite verbal that there is a type error with some extra information. On deeper
nested types, the result of a conditional type can also nicely being matched by
a `TypeError` as well. This works as long as the conditional type does not
resolve to any error type on any successful branch.

Example:

```typescript
type SomeConditionalType<Subject> = Subject extends MyCondition
  ? "everything is great and fine"
  : TypeError & "my condition isn't fulfilled";

type SomeHigherType<Input> =
  SomeConditionalType<Input> extends TypeError
    ? "there is something wrong down the road"
    : "just continue...";
```

There are various other scenarios where is desirable to provide descriptive type
errors. The actual shapes can vary for the respective use cases. At their core,
they should be communicative to improve the developer experience. Literal
strings are the shared puzzle piece.
