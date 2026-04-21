# Decision Records

We value the importance of documenting decisions constantly. Big important
architectural decisions as well as the small ones for design choices, tooling,
formatting etc. The decision records capture the reasoning and original context.
This enables us to take informed decisions, improve onboarding and prevent
unintentional reversals.

To support a culture where documenting decisions becomes natural, they should be
low effort and allowed to be lightweight. Minimal records are better than none.
Decisions can vary in size and so should their records.

For further details and reasoning, check out the initial [decision record](./0000-use-decision-records.md).

## Usage

Decision records can be discovered as plain list of files within the directory
of this README. Based on their sequential number prefix, they can be sorted in
chronological order.

Decision records might be link to some initial research they are based on. Such
research documents reside in the `research` directory.

## Writing a Decision Record

Our decision records use the [MADR](https://github.com/adr/madr) (Markdown
Architectural Decision Records) template. We do not prescribe specific tooling.
Team members may use them locally by preference.

These are the typical steps:

1. Copy the [template file](./template.md) with the next sequential number and matching title. Check out existing record files or check out the [naming schema specification](./0000-use-decision-records.md#directory-and-file-naming).
2. Fill in the sections, while stripping optional sections and metadata as appropriately for the respective decisions. Minimal and heavily stripped records are appreciated.
3. Create a pull request with status `proposed` to request for comments
4. Once the decision is `accepted`, change the status accordingly and merge the pull request.

Decision records might just capture the result of discussions in internal
meetings or workshops. In such a case, the record can be committed directly with
the `accepted` status.
