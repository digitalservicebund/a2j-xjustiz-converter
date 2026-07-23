# Design Principles

At the current point in time, this document consist of a loose collection of
principles per section. Many of them have their root in the
[decision-records](./documentation/decision-records/).

## Progressive Implementation by Use Case

We do not intend to implement the full XJustiz standard as it its entirety.
Based on the use cases by the Onlinedienste der Justiz, we continuously discover
the standard and progressively implement what is required. To goal is not an
all-encompassing, generic solution that just covers everything. We wanna provide
true value to the Onlinedienste, providing them with solutions that helps them
to provide the best possible end-user experience.

However, we put great effort into a solid foundation that enables us to speed up
over time without loss in quality. Discovering and implementing new aspects of
the standard should become a standardized workflow, accelerated by the strong
base we created.

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

For better compatibility, German umlaut vowels and Eszett are transliterated
(e.g. `ä` -> `ae`, `ß` -> `ss`) when used for symbols/identifiers in program
code. Furthermore, we sadly can not apply gender neutral language
everywhere in code. Identifiers do not support colons or similar
punctuation. Other attempts to encode these conventions in typical camel,
snake, or other case types produce names that are difficult
to read. Especially when used in conjunction with more words to compose function
names for example (e.g. `klaegerInBestimmen`). Domain terms in code should
use the simplest, most readable form of the word.

## Schema References for JSON Files

Any JSON file in the repository that follows a schema must reference it, using
the top level `$schema` property. This provides various benefits like
validation, autocompletion, documentation hints etc. Unfortunately, there is no
proper static analysis tool that could be added to our quality assurance to
validate JSON files by their schema.

Note that there is no proper standard to reference schemas in YAML files.

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

## Intentionally Curate Order in Files Top to Down

The order of the content in a file has an impact on the reader. This is equally
true for source code modules as well as many other kinds of files. Especially
for code, the most important elements should be at the top. In best case,
the primary export(s) are at the beginning of a file, because this is what the
module is about. A reader who opens the file should start here as proper entry
point to the module. Implementation details and supporting elements should be
placed further down, creating an almost linear reading flow where possible.
This is a subjective human process, manually improving the readability of code.
However, there are also some exceptions. For example, there are scenarios where
the compiler or runtime enforces a certain order. Though, it is sometimes
possible to use creative ways that maintain a better ordering. In-source tests
are always expected at the end of a file after the implementation.

For example, when a function is composed of multiple nested functions, the top
level function should come first followed by lower level functions. There is no
strict rule for "walking the call graph". Like there is no strong opinion for
a depth- or breadth-first approach. Extracted constant values should be placed
close to where they are used, preferably below related functions if it doesn't
hurt the readability. The same goes for types or other language constructs. The
ordering rules for compositions remain.

## Testing

### In-Source Tests

We believe in the importance of maintaining a high cohesion between tests and
their implementation. Therefore, we keep unit tests as in-source tests in the
respective module of the unit. Good written test cases can act as supportive
documentation in a module for developers working on it.

To keep modules with in-source tests clean, we don't mix test related imports
with those used at production runtime. Therefore, we use asynchronous import
calls inside the behavioral description block of the in-source tests. Exception
are type imports, which can't be important dynamically at runtime.

## Reference Global APIs Explicitly

To remain flexible and environment agnostic, global APIs like `Intl`, `Crypto`,
or `Temporal` must be accessed explicitly via the global context object using
`globalThis` (e.g. `globalThis.Intl`). This also makes external dependencies
more explicit and discoverable.

APIs that are not part of the ECMAScript itself, should be explicitly declared
in `package/src/global.d.ts` and communicated to library users in the
[list of requirements](./package/README.md#requirements).
