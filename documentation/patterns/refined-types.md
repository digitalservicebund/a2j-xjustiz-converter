# Refined Types

## Problem

In the schemata for the XJustiz standard, there are multiple scalar datatypes
that don't map to a plain TypeScript type, but carry additional invariants.
A quick example is the scalar for positive integers that is a restricted number
type. But there are also various of scalars based on strings, that are
restricted in their allowed character sets. Following the type-driven
development these scalars must be properly represented, using the "parse don't
validate" pattern, to work securely with the schemata.

The parsing of input values to construct scalars must act as clear error
boundary for library users. The parsing can result either successfully into a
valid scalar value instance or fail with some issues that must be handled. The
handling of parse results must be as convenient as possible for library users.

In addition to the parsing of dynamic input data at runtime, compile-time
parsing for static literal values should be added to significantly improve the
usability where possible. Using type-level computation, the parse result can be
predetermined by the compiler. This is relevant for any constant values that are
statically known at compile time, like plain-text building blocks. Compile-time
parsing provides early feedback and allows for unconditional usage, directly
supported by the compiler. This rules out a full class of errors that would be
awkward to handle at runtime.

## Solution

Scalars of this kind are represented as opaque types, using a branding
technique. Instances can be constructed by parsing input values, verifying
the invariants of the respective scalar. For example, a text based scalar with
restricted character set is opaque to a plain string with the invariant that
only allowed characters are contained.

Because refined types get parsed once and are opaque otherwise, it must be
ensured that they are read-only. Without this restriction, invariants would be
asserted during parsing, but can be violated anytime afterward by alternating
the variable.

For additional convenience, each refined type supports the [Standard
Schema](https://standardschema.dev/schema) that significantly reduces the effort
for library users, by integrating directly with schema and form input libraries
(e.g. `zod` or `react-hook-form`).

The following sections describe the different aspects in detail. They build on
top of each other, constructing a full example. As final piece, the shared
factory wraps up everything as [the canonical
implementation](../../package/src/xjustiz-schemata/shared-kernel/refined-types.ts).

### Branding

Branding is implemented by extending a plain type with a tag that only exists in
type system. Hence, instances are opaque and resolve to just the plain type at
runtime. For example, a branded string is just a plain string at runtime. The
branding exists solely for the compiler and is stripped during transpilation.

For the tagging, a unique symbol is declared local to the module that hosts the
refined type. We explicitly do not have a reusable base type for branding, that
typically uses a plain string. While this approach is quite common, it is also
less secure and requires more discipline of developers, including users of the
library. Unique symbols that are locally declared in a module require more
violative type escaping techniques that are less likely to happen and easier to
spot in cases they should. In practice this demands a separated module per
refined type. Only this module of the refined type itself is allowed to assert
the compiler that an input is a valid instance via its parsing functions. This
convention can't be assured by code but **must be ensured by developers**!
A custom linting rule can help to better enforce this.

Following the design principle of descriptive type errors, an example branding
for a plain string looks like this:

`slug.ts`:

```typescript
declare const TAG: unique symbol;

export type Slug = string & {
  readonly [TAG]: "Use the slug() factory function to construct valid instances.";
};
```

### Runtime Parsing

The runtime parsing is the core of a refined type, attesting the invariants.
A parse function takes an input value of the type it is opaque to. And it
returns a result that can either be a successfully parsed instance of the
refined type or a failure with some parsing issues. The result must be
compatible to the Standard Schema.

A first version of a parse function could look like this. This example includes
some first issues with template messages depending on the actual input.

`slug.ts`:

```typescript
function parseSlug(input: string): Result<Slug> {
  if (input === "") {
    return { issues: [{ message: "Slugs must not be empty" }] };
  } else {
    const indexOfFirstWhitespace = input.indexOf(" ");
    const hasWhitespace = indexOfFirstWhitespace >= 0;

    if (hasWhitespace) {
      return {
        issues: [
          { message: `Slug contains whitespace at ${indexOfFirstWhitespace}` },
        ],
      };
    } else {
      return { value: input as unknown as Slug }; // Only allowed with great care inside the module of the refined type.
    }
  }
}
```

### Customization of Issue Reporting

For library users it is essential to customize the actual reported messages of
parsing issues. Such message could become end-user facing and might also need
internationalization.

Therefore, parse functions must be independent of the exact messages and must
allow for optional configuration. However, default issue messages must be
provided as fallback. A message can either be a plain string or a template that
receives additional metadata in relation to the exact input.

To avoid issues with higher-kinded types down the type-system, parse function
must use a nested curry structure to receive the configuration of to use issue
messages. An extended version of the parse function looks then like this:

`slug.ts`:

```typescript
function parseSlug(issueMessages = DEFAULT_ISSUE_MESSAGES) {
  return function parse(input: string): Result<Slug> {
    if (input === "") {
      return { issues: [{ message: issueMessages.empty }] };
    } else {
      const indexOfFirstWhitespace = input.indexOf(" ");
      const hasWhitespace = indexOfFirstWhitespace >= 0;

      if (hasWhitespace) {
        return {
          issues: [
            { message: issueMessages.whitespace(indexOfFirstWhitespace) },
          ],
        };
      } else {
        return { value: input as unknown as Slug };
      }
    }
  };
}

const DEFAULT_ISSUE_MESSAGES = {
  empty: "Slugs must not be empty",
  whitespace: (position: number) => `Slug contains whitespace at ${position}`,
} satisfies IssueMessages; // Attention: temporal solution only.
```

### Compile-Time Parsing

Refined types should support compile-time parsing when possible by type-level
computation. The parsing on the type-level happens analog to the runtime level.
It is basically an extension on top of the signature of the parsing function
that predetermines the returned result when applicable. It might be, that only
a subset of possible input values can be parsed at compile-time, due to compiler
and language restrictions.

Therefore, a generic parse type gets defined. This type either resolves to
a successful result or a failure with a message. Using this type in the
signature of the parse function, the compiler can predetermine the result of
a parse call, if the input argument is a static literal. Because the compiler
can't work this out deeply with the runtime implementation, a deliberate type
cast of the public function signature is required.

In addition, to make runtime and compile-time issue messages as coherent as
possible, the default issue messages should be reused inside the type parsing.
This works only for plain string messages. Parsing issues with a template
message must either fill in metadata at type-level or use a static version to
avoid type-level computation complexity.

`slug.ts`:

```typescript
type ParseSlug<Value extends string> =
  IsLiteral<Value, string> extends false // Default check for full security.
    ? FailureResult<"compile-time parsing only works for static literals">
    : Value extends ""
      ? FailureResult<typeof DEFAULT_ISSUE_MESSAGES.empty>
      : Value extends `${string} ${string}`
        ? FailureResult<"Slugs must contain no whitespace characters"> // static template
        : SuccessResult<Slug>;

// Changes to the existing code snippets to make this work as full set:

function parseSlug(issueMessages: SlugIssueMessages = DEFAULT_ISSUE_MESSAGES) {
  // Simple signature is still relevant for function body.
  return function parse(input: string): Result<Slug> {
    // ...
  } as <Value extends string>(
    input: Value,
  ) => LiteralAwareResult<string, Value, ParseSlug<Value>, Slug>; // compile-time parsing applied
}

const DEFAULT_ISSUE_MESSAGES = {
  // ...
} as const; // Else the compile-time parsing errors don't work properly.

type SlugIssueMessages = DeepLiteralToPrimitive<typeof DEFAULT_ISSUE_MESSAGES>;
```

Notice, that the parse function always runs. Independent of if the result can be
predetermined on a type-level at compile-time. In case of abusive usage or
a bug, this can lead to uncaught exceptions in production when trying to access
the parsed `value` property of an actual failure result.

### Shared Factory Implementation

A refined type will be wrapped up by creating a factory instance that ensures
certain requirements on the type level and reduces boilerplate code.

`slug.ts`:

```typescript
export const slug = defineRefinedType(isString, parseSlug);
```

The resulting factory can the be used as this:

```typescript
// Plain runtime parsing that can succeed or fail.
const result = slug(someInput);

// Direct usage, supported by compile-time parsing.
const value = slug("valid-static-literal").value;

// Impossible, always a failure with static issue.
slug("invalid static literal").value;

// Customizing messages for reported parsing issues.
const customSlug = slug.customize({
  empty: "Missing input",
  whitespace: (position) => `Please remove the whitespace at ${position}`,
});

customSlug(someInput);
```

In addition to the parse function itself, a type guard function for the `Input`
type must be provided too. It bridges the gap to the actual parse function,
when parsing `unknown` values. This is relevant in the context of the Standard
Schema, explained below.

### Standard Schema

There is no extra work needed to support the Standard Schema by a refined type.
The factory will take care of the boilerplate to become a compliant schema by
itself. Practically this means to inject a "hidden" `~standard` property. This
includes a validation function plus some metadata.

```typescript
// Use factory object directly where applicable.
const mySchema = someSchemaLibrary({ foo: slug });
```

The standard expects inputs to be of type `unknown`. This is what the already
mentioned type guard function (`isInputType`) takes care of, to bridge the gap
to the actual parse function of the refined type.

Notice that there is a little quirk in the terminology between our refined types
pattern and the Standard Schema. Taking the angle of a schema, the standard uses
the term "validation". Coming from a "parse don't validate" approach, we
strictly talk about "parsing". Which could be paraphrased as validating once and
then maintaining the invariants through a read-only tagged type constant. So the
`Input` and `Output` type are not the same, properly expressed on the schema.
Inputs get transformed into outputs - valid scalar values.
