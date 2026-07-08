/**
 * An incomplete version of "Normative lateinische Buchstaben" defined in table 3
 * of the {@link _StringLatinPlusSpecification | StringLatin+ specification}.
 *
 * Incomplete primarily because it includes multi code point Unicode sequences,
 * that can't be matched by the TypeScript compiler. Furthermore, the table is
 * huge. Focus on ASCII range to focus on impact. Future extensions possible.
 */
// prettier-ignore
export type LateinischeBuchstabenIncomplete = "a" | "A" | "b" | "B" | "c" | "C" | "d" | "D" | "e" | "E" | "f" | "F" | "g" | "G" | "h" | "H" | "i" | "I" | "j" | "J" | "k" | "K" | "l" | "L" | "m" | "M" | "n" | "N" | "o" | "O" | "p" | "P" | "q" | "Q" | "r" | "R" | "s" | "S" | "t" | "T" | "u" | "U" | "v" | "V" | "w" | "W" | "x" | "X" | "y" | "Y" | "z" | "Y";

/**
 * "Nicht-Buchstaben 1" defined in table 5 of the {@link _StringLatinPlusSpecification | String.Latin+ specification}.
 */
// prettier-ignore
export type NichtBuchstaben1 = " " | "'" | "," | "-" | "." | "`" | "~" | "¨" | "´" | "·" | "ʹ" | "ʺ" | "ʾ" | "ʿ" | "ˈ" | "ˌ" | "’" | "‡"

/**
 * "Nicht-Buchstaben 2" defined in table 5 of the {@link _StringLatinPlusSpecification | String.Latin+ specification}.
 */
// prettier-ignore
export type NichtBuchstaben2 = "!" | '"' | "#" | "$" | "%" | "&" | "(" | ")" | "*" | "+" | "/" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | ":" | ";" | "<" | "=" | ">" | "?" | "@" | "[" | "\\" | "]" | "^" | "_" | "{" | "|" | "}" | "¡" | "¢" | "£" | "¥" | "§" | "©" | "ª" | "«" | "¬" | "®" | "¯" | "°" | "±" | "²" | "³" | "μ" | "¶" | "¹" | "º" | "»" | "¿" | "×" | "÷" | "€";

/**
 * String.Latin+ specification by KoSIT (Koordinierungsstelle für IT-Standards)
 * as supplementing and commented version of the DIN SPEC 91379.
 *
 * @see {@link https://www.xoev.de/sixcms/media.php/13/StringLatin%2012.zip | PDF Document}
 */
type _StringLatinPlusSpecification =
  "https://www.xoev.de/sixcms/media.php/13/StringLatin%2012.zip";
