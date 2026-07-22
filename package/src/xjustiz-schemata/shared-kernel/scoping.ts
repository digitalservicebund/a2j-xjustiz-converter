import { type Invariant } from "~/metatypes";

/*
 * This is the canonical reference implementation of the scoping pattern. Check
 * out the [documentation](../../../../documentation/patterns/scoping.md) for
 * reasoning and further details. Practical examples can be discovered by
 * inspecting reference usages in the codebase.
 */

declare const TAG: unique symbol;

/**
 * Auxiliary type that can be used to tag a main type, allowing it to become
 * scoped. This makes the main type generic over a scope, ensuring that
 * instances of different scopes can't be mixed with each other. For example,
 * this can be used with identifiers, which are scoped to a single document.
 *
 * The construction of the main type with unique scopes should then be done
 * using the {@link withScope} function.
 *
 * A heavily simplified example could look like this, using a generically scoped
 * document type with identifiers using scoped "A" and "B":
 * @example
 * ```typescript
 * type MyIdentifier<DocumentScope> = number & WithScope<DocumentScope>;
 * type SomeDocument<Scope> = { identifier: MyIdentifier<Scope> };
 *
 * const firstDocument = { identifier: 0 } as SomeDocument<"A">;
 * const secondDocument = { identifier: 0 } as SomeDocument<"B">;
 * firstDocument.identifier = secondDocument.identifier // compiler error
 * ```
 */
export type WithScope<Scope> = {
  readonly [TAG]: ScopeGuard<Scope>;
};

/**
 * Produces a unique scope type that is passed securely to a scoped execution
 * block. Thereby, no two instances of a type tagged with the {@link WithScope}
 * auxiliary type can be mixed between two different {@link withScope}
 * invocations. The scope type lives only within the context of a single call.
 *
 * Notice that the scope value itself is a unique symbol at runtime. However, it
 * doesn't provide the same strong security properties as the scope type. In
 * practice, the runtime value should not be used for anything but as carrier of
 * the type at compile-time.
 *
 * In combination with functions that depend on a unique scope, the scope
 * parameter can be forwarded directly without having to deal with any
 * intermediate generics. This makes it a clean developer experience.
 *
 * @example
 * ```typescript
 * const output = withScope((scope) => {
 *  const value = produceSomethingScoped(scope);
 *  // ...
 * });
 *
 * declare function produceSomethingScoped<Scope>(
 *   _scope: WithScope<Scope>
 * ): SomethingScoped<Scope>;
 * ```
 * **ATTENTION:**
 * Because the scope is guarded to be invariant, the `Output` type itself can
 * technically NOT be based on the scope. Hence, the scope can only be used
 * internally without leaking outside the {@link withScope} invocation. See the
 * pattern documentation for details — linked at the top of this module.
 */
export function withScope<ScopeFreeOutput>(
  scopedBlock: <UniqueScope>(scope: WithScope<UniqueScope>) => ScopeFreeOutput,
): ScopeFreeOutput {
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- explicit cast "trick" for branding
  const scope = Symbol(
    "unique scope representative (don't actually use at runtime, compile-time construct)",
  ) as unknown as WithScope<unknown>;

  return scopedBlock(scope);
}

/**
 * The guard of a scope ensures that `ScopeGuard<ScopeOne>` and
 * `ScopeGuard<ScopeTwo>` are never mutually assignable, except if `ScopeOne` and
 * `ScopeTwo` are truly identical.
 */
type ScopeGuard<Scope> = Invariant<Scope>;

if (import.meta.vitest) {
  const { describe, it, expect, vi } = import.meta.vitest;

  describe("scoping", () => {
    describe("with scope", () => {
      it("calls the given callable", () => {
        const callable = vi.fn(() => "some output");

        const output = withScope(callable);

        expect(callable).toHaveBeenCalledOnce();
        expect(output).toEqual("some output");
      });

      it("provides a unique scope per call", () => {
        type SomethingScoped<Scope> = string & WithScope<Scope>;

        withScope(<OuterScope>(_outerScope: WithScope<OuterScope>) => {
          const valueInOuterScope = "value" as SomethingScoped<OuterScope>; // oxlint-disable-line

          withScope(<InnerScope>(_innerScope: WithScope<InnerScope>) => {
            // @ts-expect-error -- type testing on a level unsupported by Vitest
            valueInOuterScope satisfies SomethingScoped<InnerScope>;
          });
        });
      });

      it("prevents the output from depending on the scope itself", () => {
        type OutputWithScope<Scope> = string & WithScope<Scope>;

        withScope(
          // @ts-expect-error -- type testing on a level unsupported by Vitest
          <Scope>(_scope: WithScope<Scope>): OutputWithScope<Scope> => "foo",
        );
      });
    });
  });
}
