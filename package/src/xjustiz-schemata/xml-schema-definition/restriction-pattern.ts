/**
 * This function is used as code-as-living-documentation approach to integrate
 * with original XSD restriction patterns directly. Alternatively, we could
 * transform patterns directly and copy them to the code. But that would require
 * either some extensive documentation that will rot over time, or the right
 * regular expressions appears as pure "magic". This is critical for
 * comprehensible correctness, but also for potential updates of the original
 * pattern with new versions.
 *
 * **ATTENTION:**
 * When introducing a new pattern or updating an existing one, double check that
 * no transformation step is missing and the output matches the expected result.
 * The output should be protected by regression tests to prevent degradation.
 */
export function transformXsdPatternToJavaScriptExpression(
  xsdPattern: string,
): RegExp {
  const numericCharacterReferencesToEscapedUnicode = (pattern: string) =>
    pattern.replace(/\\?&#x([0-9a-fA-F]{4});/g, "\\u$1"); // e.g. "&#x1E63;" -> "\u1E63"

  const removeCapturingFromMatchGroups = (pattern: string) =>
    pattern.replace(/\\.|(\((?!\?))/g, (match, openParenthesis) =>
      openParenthesis ? "(?:" : match,
    ); // e.g. "\\(A-Z)" -> "\\(?:A-Z)" (handles preceding escapes cases with `\`)

  const addExplicitLineMatching = (pattern: string) => `^${pattern}$`;

  const transformationSteps = [
    numericCharacterReferencesToEscapedUnicode,
    removeCapturingFromMatchGroups,
    addExplicitLineMatching,
  ];

  const javaScriptPattern = transformationSteps.reduce(
    (pattern, step) => step(pattern),
    xsdPattern,
  );

  return new RegExp(javaScriptPattern, "u");
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("restriction patterns", () => {
    describe("transform XSD pattern to JavaScript expression", () => {
      it("always adds explicit line matching", () => {
        expect(transformXsdPatternToJavaScriptExpression("foo").source).toEqual(
          "^foo$",
        );
      });

      it("maps numeric character references to escaped unicode", () => {
        expect(
          transformXsdPatternToJavaScriptExpression("&#x1E63;").source,
        ).toEqual(new RegExp(String.raw`^\u1E63$`).source); // address normalization

        expect(
          // oxlint-disable-next-line no-useless-escape -- original example from XSD
          transformXsdPatternToJavaScriptExpression("\&#x1E63;").source,
        ).toEqual(new RegExp(String.raw`^\u1E63$`).source); // address normalization
      });

      it("makes removes capturing from match groups", () => {
        expect(
          transformXsdPatternToJavaScriptExpression("(a-z)-(0-9)").source,
        ).toEqual("^(?:a-z)-(?:0-9)$");
      });

      it("sets the Unicode flag", () => {
        expect(
          transformXsdPatternToJavaScriptExpression("anything").flags,
        ).toEqual("u");
      });
    });
  });
}
