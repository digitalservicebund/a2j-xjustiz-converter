/**
 * A recursive version of the native `Readonly` type that marks the whole type
 * structure as read-only deeply.
 */
export type DeepReadonly<Structure> = unknown extends Structure
  ? "unknown types can not become readonly"
  : Structure extends Primitive
    ? Structure
    : Structure extends (infer Item)[]
      ? ReadonlyArray<DeepReadonly<Item>>
      : Structure extends object
        ? { readonly [Key in keyof Structure]: DeepReadonly<Structure[Key]> }
        : Structure;

export type DeepLiteralToPrimitive<Literal> = Literal extends Primitive
  ? LiteralToPrimitive<Literal>
  : Literal extends readonly (infer Item)[] // array
    ? DeepLiteralToPrimitive<Item>[]
    : Literal extends (...parameters: infer Parameters) => infer Return
      ? (...parameters: Parameters) => Return // keep functions untouched
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
