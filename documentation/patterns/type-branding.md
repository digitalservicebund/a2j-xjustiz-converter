# Type Branding

## Problem

Various implementation patterns require to encode invariants on top of plain
types. These can be as straightforward as the new type pattern to distinguish
a string representing an email address from a string for a UUID. But also
for refined types with smart constructors and others. The control over the
invariants should be tightly confined to a dedicated module.

## Solution

Branding is implemented by extending a main type with a tag. That tag exists
only in the type system. During runtime the branded type is reduced to the
tagged main type only. For example, a branded string is just a plain string at
runtime. The branded type exists solely for the compiler and is stripped during
transpilation.

### Tagging

A tag is added to a main type by intersection with an object type, that has
a read-only property based on a unique symbol as key. This makes it distinct
from the raw main type in a unique way. The tagged intersection is opaque,
preventing arbitrary construction by anyone. The result is called the branded
type.

The value of the property can vary based on the exact use case. The standard
case is a static string literal with a helpful message. This message will be
picked up by the TypeScript compiler and is visible in error message, in case
a wrong instance was provided. Other cases can extend the tag, adding further
type constraints into the value of it.

The unique symbol is declared local to the module that hosts the branded type.
There is no runtime value for it, just the raw type declaration. This increases
the protection for the branded type, requiring much more violative type escaping
techniques to construct incorrect or fake instances of the type. Such offense
are less likely to happen and are easier to spot in cases they should. This
approach strongly suggests to use a separate module per branded type.

A minimal example for a branded type could look like this:

`email.ts`:

```typescript
declare const TAG: unique symbol;

/**
 * Representation of an Email address to identify mailboxes for messages.
 *
 * Valid addresses follow the syntax specified in RFC 5321 and 5322. The common
 * structure looks like "local-part@domain". For example max@mustermann.de.
 *
 * Instances can be constructed using {@link exampleFunction}.
 */
export type Email = string & {
  readonly [TAG]: "A useful hint to the user how to actually construct an Email.";
};
```

There is explicitly no reusable base type for branding by a canonical reference
implementation. This approach is pretty common and often uses a generic type
parameter for the tag value. But this less secure and requires more discipline
of developers, including users of the library. A single line of code to declare
a local unique symbol quickly offsets the import of a base brand type. Notice
that there still can be branded types which themselves are generic to a type
parameter — on top of the branding.

### Smart Constructors & Manipulation

The actual construction of instances for the branded type can differ depending
on the actual use case and higher level implementation pattern. Some might
provide a parse function that returns constructed instances, having all
invariants validated (see [refined types pattern](./refined-types.md)).

It is important, that the explicit casting of the type happens only within the
module of the branded type. This acts security boundary. Any occurrence of some
code that casts to a branded type in a module that does not contain the related
tag symbol declaration is a violation of this pattern! This rule can't be
assured by code but **must be ensured by developers!** A custom linting rule can
help to better enforce this.

Although the unique symbol is declared within the same module, it is still
necessary to cast to the branded type. In the example of the `Email`, a string
must be cast to the `Email` type. For the majority of main types, it is just not
possible to construct an actual valid instance of the branded type (e.g.
a string intersected with an object for the tag). Plus, the symbol of the tag
property itself is only declared as type, but without an actual runtime value
for it. Therefore, it is necessary to apply typecasting. This is basically an
explicit call to the compiler. Thereby, it will likely violate linting rules of
static code analysis tools. A comment to ignore the respective rule for the
specific line is the common practice. A short explanation should be
supplemented.

```typescript
export function email(input: string): Email {
  /* Validate input... */

  // oxlint-disable-next-line no-unsafe-type-assertion -- explicit cast for branding
  return input as unknown as Email;
}
```

### Read-Only Requirement

Branded type instances should be read-only. Else, created instances can
be manipulated and invariants violated. For branded types that tag a primitive
TypeScript type, this is the case by default.

```typescript
// Numbers are read-only by default.
type PhoneNumber = number & {
  /* tagging ... */
};

// Objects must be made read-only.
type Address = DeepReadonly<{
  street: string;
  houseNumber: number;
  postalCode: string;
}> & {
  /* tagging ... */
};
```
