# Codelisten

## Problem

In the schemata of the XJustiz standard, there is the concept of so called
Codelisten. These are basically fixed lists of possible code values with
description — like an enumeration. Each Codelisteneintrag is identifies by its
numeric code. This is also the only part that is included in an
XJustiz-Nachricht for transfer. Furthermore, Codelisteneintrag usually has some
descriptive field that is more human readable like Wert, Name, or Bezeichnung.
For example, in the Codeliste for Geschlecht the code `2` has the Wert
`weiblich`. Or in the Codeliste for Währung the code `EUR` has the
Beschreibung `Euro`.

When composing an XJustiz-Nachricht, Codelisten must be a restrictive type
by the schema, but it should also be possible to provide values in a human
readable format.

## Solution

Each Codeliste is represented as an enumeration. Codelisteneinträge become
members of the enumeration. The name of each member should be based on
a descriptive field that suits this purpose best (short, concise). The
initializer becomes the code itself. This way, Codelisten become nice to use.
In contrast to plain string unions, the TypeScript compiler does not inline
them, making the name of the Codeliste directly readable for library users.
Also, values can be provided using the enumeration with its descriptive names,
without having to know the underlying codes. The data itself properly contains
the actual code automatically.

The names of enumeration members are idiomatically in PascalCase. The chosen
descriptive field of the respective Codeliste must be formatted for compliance.
Fields like Wert are usually concise, but can still contain whitespaces, dashes,
and other symbols not allowed as member name. After all, the name must only be
just clear enough. [Design
principles](../../DESIGN_PRINCIPLES.md#german-domain-language) for the German
language in code apply — like transliterations.

While the codes for many Codelisten look like numbers, they are technically
strings. This can't be simplified, because there are codes like `"012"`, which
would be just `12` as number. Besides, there are multiple Codelisten where the
code could not be interpreted as number (e.g. Währung).

`Geschlecht.ts`:

```typescript
export enum Geschlecht {
  Unbekannt = "0",
  Maennlich = "1",
  Weiblich = "2",
  Divers = "3",
  Saechlich = "4",
}
```

Codelisten can be long and extensive. Following the [design
principles](../../DESIGN_PRINCIPLES.md#progressive-implementation-by-use-case),
Codelisten are also progressively implemented by use case. That means members
are reduced to relevant Codelisteneinträge. The Court Communication team
provides the domain expertise for the Access to Justice project. Thereby, the
need for new Codelisteneinträge can be recognized and added early in the
process.

### Why Not ..?

#### Constant Enumerations

To avoid any issue upstream for library users, it is important to use plain
enumerations. That means no `const enum` declarations. For single file
transpilers this can cause runtime crashes.

#### Symbol Enumerations

The implementation pattern of a symbol enumeration complements the strong
compile-time properties of enumerations with unique runtime symbols as
initializer for members. Thereby, no two initializers can be equal, not even at
runtime. However, symbols can't be serialized natively. This is missed quickly
without care, causing unexpected issues late in the pipeline. After all, codes
are only unique within their Codeliste. Issues in the XJustiz-Converter are
avoided at compile-time when composing a message.

Example of a symbol enumeration:

```typescript
export const Geschlecht = {
  Unbekannt: Symbol("0"),
  Maennlich: Symbol("1"),
  Weiblich: Symbol("2"),
  Divers: Symbol("3"),
  Saechlich: Symbol("4"),
} as const;

export type Geschlecht = (typeof Geschlecht)[keyof Geschlecht];
```
