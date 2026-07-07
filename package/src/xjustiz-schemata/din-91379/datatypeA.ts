import type { DeepLiteralToPrimitive } from "~/metatypes";
import {
  defineRefinedType,
  isString,
  type Result,
  type RefinedTypeFactory, // oxlint-disable-line no-unused-vars -- referenced by TSDoc
} from "~/xjustiz-schemata/shared-kernel/refined-types";

declare const TAG: unique symbol;

/**
 * Datatype A of the DIN SPEC 91379 norm. A string with restricted character set.
 *
 * Meant to be used for names of natural persons on sovereign official documents.
 * Includes all Latin characters, plus additional non-letters of group N1
 * ("Nicht-Buchstaben N1") that are necessary to represent names for romanized
 * transliterations.
 *
 * See the related {@link datatypeA | refined type factory} for construction.
 */
export type DatatypeA = string & {
  readonly [TAG]: "Use the datatypeA() factory function to construct valid instances.";
};

function parseDatatypeA(
  issueMessages: DatatypeAIssueMessages = DEFAULT_ISSUE_MESSAGES,
) {
  return function parse(input: string): Result<DatatypeA> {
    const composedUnicodeInput = input.normalize("NFC");

    if (DATATYPE_A_PATTERN.test(composedUnicodeInput)) {
      return { value: composedUnicodeInput as unknown as DatatypeA };
    } else {
      const characters = findInvalidCharacters(input);

      return {
        issues: [{ message: issueMessages.invalidCharacters(characters) }],
      };
    }
  };
}

const DEFAULT_ISSUE_MESSAGES = {
  /**
   * @param characters - graphemes as phoneme units in composed Unicode format
   */
  invalidCharacters: (characters: Set<string>) =>
    `Contains characters not allowed by DIN 91379 Datentyp A: ${[...characters].map((character) => `'${character}'`).join(", ")}`,
} as const;

type DatatypeAIssueMessages = DeepLiteralToPrimitive<
  typeof DEFAULT_ISSUE_MESSAGES
>;

/**
 * Factory function object for the {@link DatatypeA} refined type.
 * See {@link RefinedTypeFactory} for further details and usage examples.
 */
export const datatypeA = defineRefinedType(isString, parseDatatypeA);

/**
 * Characters are understood as linguistic graphemes, which the datatype pattern
 * is defined for.
 *
 * **ATTENTION:**
 * This is only meant to find invalid characters, knowing the input isn't valid
 * as whole. The used algorithm isn't performant enough to be used for fast
 * parsing.
 */
function findInvalidCharacters(input: string): Set<string> {
  return new Set(
    segmentUnicodeIntoLinguisticGraphemes(input.normalize("NFC")).filter(
      // IMPORTANT: Assumption that pattern can match single graphemes.
      (grapheme) => !DATATYPE_A_PATTERN.test(grapheme),
    ),
  );
}

/**
 * Improved version of {@link Intl.Segmenter.prototype.segment} to properly
 * address binary diacritic clustering.
 *
 * The function can be used to work with the graphemes ("characters") in
 * a linguistic way. This is for example critical when working with regular
 * expressions on the unit of a grapheme (read: test by character, not full
 * string) where binary diacritics play a role (e.g. for DIN 91379).
 *
 * There are unary and binary diacritics. Unary ones combine with a single
 * preceding base letter into a grapheme (e.g. "À" or "ç"). Multiple unary
 * diacritics can also be merged to a shared base letter into a single grapheme
 * (e.g. "R̥̄" or "L̥̄"). Binary diacritics apply to two base letters on their left
 * and right as a single grapheme (e.g. "K͟H" or "T͡s").
 * Unicode treats binary diacritics as unary ones, splitting an actual linguistic
 * grapheme of a single phoneme unit into two clusters. For example, the grapheme
 * "K͟H" (`'\u004B\u035F\u0048'`) becomes "wrongly" split into two clusters of "K͟"
 * and "H" (`['\u004B\u035F', '\u0048']`).
 */
function segmentUnicodeIntoLinguisticGraphemes(text: string): string[] {
  const unicodeGraphemeClusters = Array.from(
    new Intl.Segmenter(UNDETERMINED_LOCALE, {
      granularity: "grapheme",
    }).segment(text),
    (segment) => segment.segment,
  );

  const linguisticGraphemes: string[] = [];

  for (let index = 0; index < unicodeGraphemeClusters.length; index++) {
    let grapheme = unicodeGraphemeClusters[index];
    if (grapheme === undefined) continue; // TypeScript can't check the loop index.
    const endsWithBinaryDiacritic = BINARY_DIACRITICS.test(grapheme);

    if (endsWithBinaryDiacritic) {
      const nextCluster = unicodeGraphemeClusters[++index];
      grapheme += nextCluster ?? "";
    }

    linguisticGraphemes.push(grapheme);
  }

  return linguisticGraphemes;
}

/**
 * Language tag for "undefined language" by IETF BCP 47 (Internet Engineering Task Force Best Current Practice).
 * Used to explicitly avoid any implicit locale determination from runtime environment.
 */
const UNDETERMINED_LOCALE = "und" as const;

const BINARY_DIACRITICS = /[\u035C-\u0362\u1DFC]$/u;

/*
 * This is the original pattern in the XML schema definition (XSD) of DIN 91379
 * as delivered in the XJustiz specification bundle.
 *
 * The pattern was authored with prioritizing the pre-composed Unicode format
 * where available. This means strings in decomposed Unicode format must first be
 * composed before the pattern can match properly.
 */
const ORIGINAL_XSD_PATTERN = String.raw`(&#x0020;|&#x0027;|[&#x002C;-\&#x002E;]|[&#x0041;-&#x005A;]|[&#x0060;-&#x007A;]|&#x007E;|&#x00A8;|&#x00B4;|&#x00B7;|[&#x00C0;-&#x00D6;]|[&#x00D8;-&#x00F6;]|[&#x00F8;-&#x017E;]|[&#x0187;-&#x0188;]|&#x018F;|&#x0197;|[&#x01A0;-&#x01A1;]|[&#x01AF;-&#x01B0;]|&#x01B7;|[&#x01CD;-&#x01DC;]|[&#x01DE;-&#x01DF;]|[&#x01E2;-&#x01F0;]|[&#x01F4;-&#x01F5;]|[&#x01F8;-&#x01FF;]|[&#x0212;-&#x0213;]|[&#x0218;-&#x021B;]|[&#x021E;-&#x021F;]|[&#x0227;-&#x0233;]|&#x0259;|&#x0268;|&#x0292;|[&#x02B9;-&#x02BA;]|[&#x02BE;-&#x02BF;]|&#x02C8;|&#x02CC;|[&#x1E02;-&#x1E03;]|[&#x1E06;-&#x1E07;]|[&#x1E0A;-&#x1E11;]|&#x1E17;|[&#x1E1C;-&#x1E2B;]|[&#x1E2F;-&#x1E37;]|[&#x1E3A;-&#x1E3B;]|[&#x1E40;-&#x1E49;]|[&#x1E52;-&#x1E5B;]|[&#x1E5E;-&#x1E63;]|[&#x1E6A;-&#x1E6F;]|[&#x1E80;-&#x1E87;]|[&#x1E8C;-&#x1E97;]|&#x1E9E;|[&#x1EA0;-&#x1EF9;]|&#x2019;|&#x2021;|&#x0041;&#x030B;|&#x0043;(&#x0300;|&#x0304;|&#x0306;|&#x0308;|&#x0315;|&#x0323;|&#x0326;|&#x0328;&#x0306;)|&#x0044;&#x0302;|&#x0046;(&#x0300;|&#x0304;)|&#x0047;&#x0300;|&#x0048;(&#x0304;|&#x0326;|&#x0331;)|&#x004A;(&#x0301;|&#x030C;)|&#x004B;(&#x0300;|&#x0302;|&#x0304;|&#x0307;|&#x0315;|&#x031B;|&#x0326;|&#x035F;&#x0048;|&#x035F;&#x0068;)|&#x004C;(&#x0302;|&#x0325;|&#x0325;&#x0304;|&#x0326;)|&#x004D;(&#x0300;|&#x0302;|&#x0306;|&#x0310;)|&#x004E;(&#x0302;|&#x0304;|&#x0306;|&#x0326;)|&#x0050;(&#x0300;|&#x0304;|&#x0315;|&#x0323;)|&#x0052;(&#x0306;|&#x0325;|&#x0325;&#x0304;)|&#x0053;(&#x0300;|&#x0304;|&#x031B;&#x0304;|&#x0331;)|&#x0054;(&#x0300;|&#x0304;|&#x0308;|&#x0315;|&#x031B;)|&#x0055;&#x0307;|&#x005A;(&#x0300;|&#x0304;|&#x0306;|&#x0308;|&#x0327;)|&#x0061;&#x030B;|&#x0063;(&#x0300;|&#x0304;|&#x0306;|&#x0308;|&#x0315;|&#x0323;|&#x0326;|&#x0328;&#x0306;)|&#x0064;&#x0302;|&#x0066;(&#x0300;|&#x0304;)|&#x0067;&#x0300;|&#x0068;(&#x0304;|&#x0326;)|&#x006A;&#x0301;|&#x006B;(&#x0300;|&#x0302;|&#x0304;|&#x0307;|&#x0315;|&#x031B;|&#x0326;|&#x035F;&#x0068;)|&#x006C;(&#x0302;|&#x0325;|&#x0325;&#x0304;|&#x0326;)|&#x006D;(&#x0300;|&#x0302;|&#x0306;|&#x0310;)|&#x006E;(&#x0302;|&#x0304;|&#x0306;|&#x0326;)|&#x0070;(&#x0300;|&#x0304;|&#x0315;|&#x0323;)|&#x0072;(&#x0306;|&#x0325;|&#x0325;&#x0304;)|&#x0073;(&#x0300;|&#x0304;|&#x031B;&#x0304;|&#x0331;)|&#x0074;(&#x0300;|&#x0304;|&#x0315;|&#x031B;)|&#x0075;&#x0307;|&#x007A;(&#x0300;|&#x0304;|&#x0306;|&#x0308;|&#x0327;)|&#x00C7;&#x0306;|&#x00DB;&#x0304;|&#x00E7;&#x0306;|&#x00FB;&#x0304;|&#x00FF;&#x0301;|&#x010C;(&#x0315;|&#x0323;)|&#x010D;(&#x0315;|&#x0323;)|&#x0113;&#x030D;|&#x012A;&#x0301;|&#x012B;&#x0301;|&#x014D;&#x030D;|&#x017D;(&#x0326;|&#x0327;)|&#x017E;(&#x0326;|&#x0327;)|&#x1E32;&#x0304;|&#x1E33;&#x0304;|&#x1E62;&#x0304;|&#x1E63;&#x0304;|&#x1E6C;&#x0304;|&#x1E6D;&#x0304;|&#x1EA0;&#x0308;|&#x1EA1;&#x0308;|&#x1ECC;&#x0308;|&#x1ECD;&#x0308;|&#x1EE4;(&#x0304;|&#x0308;)|&#x1EE5;(&#x0304;|&#x0308;))*`;

const DATATYPE_A_PATTERN =
  transformXsdPatternToJavaScriptExpression(ORIGINAL_XSD_PATTERN);

/*
 * This function is used as code-as-living-documentation approach to integrate
 * with the original XSD pattern directly. Alternatively, we could have
 * transformed the pattern directly and copied here. But that would require
 * either some extensive documentation that will rot over time, or the right
 * pattern appears as pure "magic". This is critical for comprehensible
 * correctness, but also for potential updates of the original pattern with new
 * versions.
 */
function transformXsdPatternToJavaScriptExpression(xsdPattern: string): RegExp {
  const numericCharacterReferencesToEscapedUnicode = (pattern: string) =>
    pattern.replace(/\\?&#x([0-9a-fA-F]{4});/g, "\\u$1"); // e.g. "&#1E63" -> "\u1E63"

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
  const { describe, it, test, expect, vi } = import.meta.vitest;

  /*
   * We don't try to test the original, copy-pasted pattern throughout, but
   * primarily focus on the implementation as refined type. The pattern
   * transformation requires special attentions, protected by test.
   */
  describe("Datatype A", async () => {
    const {
      assert,
      property,
      string: arbitraryString,
    } = await import("fast-check");

    describe("parsing", () => {
      it("is successful for an empty string", () => {
        expect(datatypeA("")).toStrictEqual({ value: "" });
      });

      test.each([
        "Marie-Hélène LefèvreFrenchhyphen",
        "François d'AlembertFrenchç",
        "José María García",
        "Íñigo de Loyola",
        "Giò Ponti",
        "Jörg Müller",
        "Käthe Kollwitz",
        "João Fernández",
        "Avel·lí Artís Gener",
        "Søren Aabye Kierkegaard",
        "Þóra JónsdóttirIcelandicÞ",
        "Owain GlyndŵrWelshŵ",
        "Małgorzata Szymborska",
        "Jiří Dvořák",
        "Ľubomír ŠimkoSlovakĽ",
        "Şükrü Öztürk",
        "Thị LươngVietnameseị",
        "Heydər Əliyev",
        "Kōnstantinos Kavaphēs",
        "Nikolaĭ Vasilʹevich Gogol",
        "Mošeh ben Maimon",
        "Shemuel Yosef ʿAgnon",
        "Yiṣḥaḳ Rabin",
        "Muḥammad ibn ʿAbd Allāh",
        "Fāṭimah al-Zahrāʾ",
        "Ẓāhir al-Dīn Muḥammad Bābur",
        "K͟hālid ibn al-Walīd",
      ])("is successful for international example name: '%s'", (name) => {
        expect(datatypeA(name)).toStrictEqual({ value: name });
      });

      test.each([
        { name: "Max Must3rmann", invalidCharacters: new Set(["3"]) },
        {
          name: "Erika (Marie) Musterfrau",
          invalidCharacters: new Set(["(", ")"]),
        },
      ])(
        "fails for structurally invalid inputs: '%s'",
        ({ name, invalidCharacters }) => {
          const template = vi.fn();
          datatypeA.customize({ invalidCharacters: template })(name);
          expect(template).toHaveBeenCalledWith(invalidCharacters);
        },
      );

      test.each([
        {
          name: "Νίκος",
          invalidCharacters: new Set(["Ν", "ί", "κ", "ο", "ς"]),
        },
        {
          name: "محمد علي",
          invalidCharacters: new Set(["م", "ح", "د", "ع", "ل", "ي"]),
        },
        {
          name: "יצחק רבין",
          invalidCharacters: new Set(["י", "צ", "ח", "ק", "ר", "ב", "י", "ן"]),
        },
        {
          name: "خالد",
          invalidCharacters: new Set(["خ", "ا", "ل", "د"]),
        },
      ])(
        "fails for not romanized transliterations for international names: '%s'",
        ({ name, invalidCharacters }) => {
          const template = vi.fn();
          datatypeA.customize({ invalidCharacters: template })(name);
          expect(template).toHaveBeenCalledWith(invalidCharacters);
        },
      );

      it("always reports at least one invalid character when failing", () =>
        assert(
          property(arbitraryString({ unit: "grapheme" }), (input) => {
            const result = datatypeA.customize({
              invalidCharacters: (characters) => [...characters].join(),
            })(input);

            return result.issues == undefined || result.issues.length >= 1;
          }),
        ));
    });

    /*
     * When this test case fails, make sure that:
     *  - the original input XSD pattern has changed by intention (only by
     *    specification update)
     *  - all invariants, transformation steps, and assumptions of the pattern
     *    in this module still apply
     *
     * BE EXTRA CAREFUL!
     */
    test("prevent regression of XSD pattern transformation and enforce careful updates", () => {
      expect(DATATYPE_A_PATTERN).toMatchInlineSnapshot(
        `/\\^\\(\\?:\\\\u0020\\|\\\\u0027\\|\\[\\\\u002C-\\\\u002E\\]\\|\\[\\\\u0041-\\\\u005A\\]\\|\\[\\\\u0060-\\\\u007A\\]\\|\\\\u007E\\|\\\\u00A8\\|\\\\u00B4\\|\\\\u00B7\\|\\[\\\\u00C0-\\\\u00D6\\]\\|\\[\\\\u00D8-\\\\u00F6\\]\\|\\[\\\\u00F8-\\\\u017E\\]\\|\\[\\\\u0187-\\\\u0188\\]\\|\\\\u018F\\|\\\\u0197\\|\\[\\\\u01A0-\\\\u01A1\\]\\|\\[\\\\u01AF-\\\\u01B0\\]\\|\\\\u01B7\\|\\[\\\\u01CD-\\\\u01DC\\]\\|\\[\\\\u01DE-\\\\u01DF\\]\\|\\[\\\\u01E2-\\\\u01F0\\]\\|\\[\\\\u01F4-\\\\u01F5\\]\\|\\[\\\\u01F8-\\\\u01FF\\]\\|\\[\\\\u0212-\\\\u0213\\]\\|\\[\\\\u0218-\\\\u021B\\]\\|\\[\\\\u021E-\\\\u021F\\]\\|\\[\\\\u0227-\\\\u0233\\]\\|\\\\u0259\\|\\\\u0268\\|\\\\u0292\\|\\[\\\\u02B9-\\\\u02BA\\]\\|\\[\\\\u02BE-\\\\u02BF\\]\\|\\\\u02C8\\|\\\\u02CC\\|\\[\\\\u1E02-\\\\u1E03\\]\\|\\[\\\\u1E06-\\\\u1E07\\]\\|\\[\\\\u1E0A-\\\\u1E11\\]\\|\\\\u1E17\\|\\[\\\\u1E1C-\\\\u1E2B\\]\\|\\[\\\\u1E2F-\\\\u1E37\\]\\|\\[\\\\u1E3A-\\\\u1E3B\\]\\|\\[\\\\u1E40-\\\\u1E49\\]\\|\\[\\\\u1E52-\\\\u1E5B\\]\\|\\[\\\\u1E5E-\\\\u1E63\\]\\|\\[\\\\u1E6A-\\\\u1E6F\\]\\|\\[\\\\u1E80-\\\\u1E87\\]\\|\\[\\\\u1E8C-\\\\u1E97\\]\\|\\\\u1E9E\\|\\[\\\\u1EA0-\\\\u1EF9\\]\\|\\\\u2019\\|\\\\u2021\\|\\\\u0041\\\\u030B\\|\\\\u0043\\(\\?:\\\\u0300\\|\\\\u0304\\|\\\\u0306\\|\\\\u0308\\|\\\\u0315\\|\\\\u0323\\|\\\\u0326\\|\\\\u0328\\\\u0306\\)\\|\\\\u0044\\\\u0302\\|\\\\u0046\\(\\?:\\\\u0300\\|\\\\u0304\\)\\|\\\\u0047\\\\u0300\\|\\\\u0048\\(\\?:\\\\u0304\\|\\\\u0326\\|\\\\u0331\\)\\|\\\\u004A\\(\\?:\\\\u0301\\|\\\\u030C\\)\\|\\\\u004B\\(\\?:\\\\u0300\\|\\\\u0302\\|\\\\u0304\\|\\\\u0307\\|\\\\u0315\\|\\\\u031B\\|\\\\u0326\\|\\\\u035F\\\\u0048\\|\\\\u035F\\\\u0068\\)\\|\\\\u004C\\(\\?:\\\\u0302\\|\\\\u0325\\|\\\\u0325\\\\u0304\\|\\\\u0326\\)\\|\\\\u004D\\(\\?:\\\\u0300\\|\\\\u0302\\|\\\\u0306\\|\\\\u0310\\)\\|\\\\u004E\\(\\?:\\\\u0302\\|\\\\u0304\\|\\\\u0306\\|\\\\u0326\\)\\|\\\\u0050\\(\\?:\\\\u0300\\|\\\\u0304\\|\\\\u0315\\|\\\\u0323\\)\\|\\\\u0052\\(\\?:\\\\u0306\\|\\\\u0325\\|\\\\u0325\\\\u0304\\)\\|\\\\u0053\\(\\?:\\\\u0300\\|\\\\u0304\\|\\\\u031B\\\\u0304\\|\\\\u0331\\)\\|\\\\u0054\\(\\?:\\\\u0300\\|\\\\u0304\\|\\\\u0308\\|\\\\u0315\\|\\\\u031B\\)\\|\\\\u0055\\\\u0307\\|\\\\u005A\\(\\?:\\\\u0300\\|\\\\u0304\\|\\\\u0306\\|\\\\u0308\\|\\\\u0327\\)\\|\\\\u0061\\\\u030B\\|\\\\u0063\\(\\?:\\\\u0300\\|\\\\u0304\\|\\\\u0306\\|\\\\u0308\\|\\\\u0315\\|\\\\u0323\\|\\\\u0326\\|\\\\u0328\\\\u0306\\)\\|\\\\u0064\\\\u0302\\|\\\\u0066\\(\\?:\\\\u0300\\|\\\\u0304\\)\\|\\\\u0067\\\\u0300\\|\\\\u0068\\(\\?:\\\\u0304\\|\\\\u0326\\)\\|\\\\u006A\\\\u0301\\|\\\\u006B\\(\\?:\\\\u0300\\|\\\\u0302\\|\\\\u0304\\|\\\\u0307\\|\\\\u0315\\|\\\\u031B\\|\\\\u0326\\|\\\\u035F\\\\u0068\\)\\|\\\\u006C\\(\\?:\\\\u0302\\|\\\\u0325\\|\\\\u0325\\\\u0304\\|\\\\u0326\\)\\|\\\\u006D\\(\\?:\\\\u0300\\|\\\\u0302\\|\\\\u0306\\|\\\\u0310\\)\\|\\\\u006E\\(\\?:\\\\u0302\\|\\\\u0304\\|\\\\u0306\\|\\\\u0326\\)\\|\\\\u0070\\(\\?:\\\\u0300\\|\\\\u0304\\|\\\\u0315\\|\\\\u0323\\)\\|\\\\u0072\\(\\?:\\\\u0306\\|\\\\u0325\\|\\\\u0325\\\\u0304\\)\\|\\\\u0073\\(\\?:\\\\u0300\\|\\\\u0304\\|\\\\u031B\\\\u0304\\|\\\\u0331\\)\\|\\\\u0074\\(\\?:\\\\u0300\\|\\\\u0304\\|\\\\u0315\\|\\\\u031B\\)\\|\\\\u0075\\\\u0307\\|\\\\u007A\\(\\?:\\\\u0300\\|\\\\u0304\\|\\\\u0306\\|\\\\u0308\\|\\\\u0327\\)\\|\\\\u00C7\\\\u0306\\|\\\\u00DB\\\\u0304\\|\\\\u00E7\\\\u0306\\|\\\\u00FB\\\\u0304\\|\\\\u00FF\\\\u0301\\|\\\\u010C\\(\\?:\\\\u0315\\|\\\\u0323\\)\\|\\\\u010D\\(\\?:\\\\u0315\\|\\\\u0323\\)\\|\\\\u0113\\\\u030D\\|\\\\u012A\\\\u0301\\|\\\\u012B\\\\u0301\\|\\\\u014D\\\\u030D\\|\\\\u017D\\(\\?:\\\\u0326\\|\\\\u0327\\)\\|\\\\u017E\\(\\?:\\\\u0326\\|\\\\u0327\\)\\|\\\\u1E32\\\\u0304\\|\\\\u1E33\\\\u0304\\|\\\\u1E62\\\\u0304\\|\\\\u1E63\\\\u0304\\|\\\\u1E6C\\\\u0304\\|\\\\u1E6D\\\\u0304\\|\\\\u1EA0\\\\u0308\\|\\\\u1EA1\\\\u0308\\|\\\\u1ECC\\\\u0308\\|\\\\u1ECD\\\\u0308\\|\\\\u1EE4\\(\\?:\\\\u0304\\|\\\\u0308\\)\\|\\\\u1EE5\\(\\?:\\\\u0304\\|\\\\u0308\\)\\)\\*\\$/u`,
      );
    });

    describe("segment Unicode into linguistic graphemes", () => {
      it("segments single letters and symbols in distinct graphemes", () => {
        expect(
          segmentUnicodeIntoLinguisticGraphemes("abcDEF!? "),
        ).toStrictEqual(["a", "b", "c", "D", "E", "F", "!", "?", " "]);
      });

      it("segments unary diacritics with their base letter into one grapheme in composed format", () => {
        expect(
          segmentUnicodeIntoLinguisticGraphemes("Àb\u0300ç\u004C\u0325\u0304"),
        ).toStrictEqual(["À", "b̀", "ç", "L̥̄"]);
      });

      it("segments binary diacritics with both letters into one grapheme in composed format", () => {
        expect(
          segmentUnicodeIntoLinguisticGraphemes("K͟H\u0054\u0361\u0073T\u035Fh"),
        ).toStrictEqual(["K͟H", "T͡s", "T͟h"]);
      });
    });
  });
}
