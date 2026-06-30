import type { DeepLiteralToPrimitive } from "~/metatypes";
import {
  defineRefinedType,
  isString,
  type Result,
  type LiteralAwareResult,
  type FailureResult,
  type SuccessResult,
  type IsLiteral,
} from "~/xjustiz-schemata/shared-kernel/refined-types";

declare const TAG: unique symbol;

export type Slug = string & {
  readonly [TAG]: "Use the slug() factory function to construct valid instances.";
};

export const slug = defineRefinedType(isString, parseSlug);

function parseSlug(issueMessages: SlugIssueMessages = DEFAULT_ISSUE_MESSAGES) {
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
  } as <Value extends string>(
    input: Value,
  ) => LiteralAwareResult<string, Value, ParseSlug<Value>, Slug>;
}

const DEFAULT_ISSUE_MESSAGES = {
  empty: "Slugs must not be empty",
  whitespace: (position: number) => `Slug contains whitespace at ${position}`,
} as const;

type SlugIssueMessages = DeepLiteralToPrimitive<typeof DEFAULT_ISSUE_MESSAGES>;

type ParseSlug<Value extends string> =
  IsLiteral<Value, string> extends false
    ? FailureResult<"compile-time parsing only works for static literals">
    : Value extends ""
      ? FailureResult<typeof DEFAULT_ISSUE_MESSAGES.empty>
      : Value extends `${string} ${string}`
        ? FailureResult<"Slugs must contain no whitespace characters">
        : SuccessResult<Slug>;
