/**
 * A recursive version of the native `Readonly` type that marks the whole type
 * structure as read-only deeply.
 */
export type DeepReadonly<Structure> = unknown extends Structure
  ? "unknown types can not become readonly"
  : Structure extends Primitive
    ? Structure
    : Structure extends (infer Item)[]
      ? readonly DeepReadonly<Item>[]
      : Structure extends object
        ? { readonly [Key in keyof Structure]: DeepReadonly<Structure[Key]> }
        : Structure;

export type DeepLiteralToPrimitive<Literal> = Literal extends Primitive
  ? LiteralToPrimitive<Literal>
  : Literal extends readonly (infer Item)[] // Array
    ? DeepLiteralToPrimitive<Item>[]
    : Literal extends (...parameters: infer Parameters) => infer Return
      ? (...parameters: Parameters) => Return // Keep functions untouched
      : Literal extends object
        ? {
            -readonly [Key in keyof Literal]: DeepLiteralToPrimitive<
              Literal[Key]
            >;
          }
        : Literal;

type LiteralToPrimitive<Literal> = Literal extends boolean
  ? boolean
  : Literal extends number
    ? number
    : Literal extends string
      ? string
      : Literal extends bigint
        ? bigint
        : Literal extends symbol
          ? symbol
          : Literal;

type Primitive = string | number | boolean | bigint | symbol | null | undefined;

export type IsAny<MaybeAny> = 0 extends 1 & MaybeAny ? true : false;

/**
 * Consumes an input string from the start until the first character is found
 * that is not included in the set of characters to consume. Resolves to the
 * remaining string, empty if fully consumed.
 *
 * @example
 * ```typescript
 * ConsumeCharactersFrom<"abcde", "ade"> // "acde"
 * ConsumeCharactersFrom<"abcde", "acb"> // "de"
 * ConsumeCharactersFrom<"abcde", ""> // "abcde"
 * ConsumeCharactersFrom<"abcde", "edcba"> // ""
 * ```
 */
export type ConsumeCharactersFrom<
  Input extends string,
  SetOfCharactersToConsume extends string,
> = Input extends `${SetOfCharactersToConsume}${infer Rest}`
  ? ConsumeCharactersFrom<Rest, SetOfCharactersToConsume>
  : Input;

/**
 * Mathematical invariant over `Basis` by putting it in a function signature
 * on the input (contravariant) as well as the output side (covariant).
 * Typically used to ensure the true identity of a base type.
 */
export type Invariant<Basis> = (basis: Basis) => Basis;
