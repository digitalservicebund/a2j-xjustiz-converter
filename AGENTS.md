# Agent Instructions

> [!IMPORTANT]
> Always use progressive disclosure to find something in the repository! Do not
> use plain discovery tools like find, grep, etc. to search by brute force. Use
> the given keywords in the prompts to find your way more quickly. In code, try
> to use language servers to discover symbols, definitions, references, etc.
> Below are the most important anchors listed.

This repository uses documentation-driven development with a structure that
allows for progressively disclosure of relevant information. The anchor for
everything is the root [README](./README.md). It provides the base context and
links to further documentation. Especially the
[documentation](./README.md#documentation) section provides a good overview where
to find what kind of information. Try to follow links directly for progressive
disclosure, instead of directly searching for files by yourself.

When writing program code, follow especially the [design
principles](./DESIGN_PRINCIPLES.md), mind the [architecture](./ARCHITECTURE.md)
and watch out for [implementation patterns](./documentation/patterns/README.md).
Check out how to run tools for working with the repository, starting of with the
[central workflow orchestrator](./documentation/tool-usage/task.md).
