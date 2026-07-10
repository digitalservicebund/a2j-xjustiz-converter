---
status: accepted
date: 2026-07-10
decision-makers: Thore Straßburg, Pram Gurusinga
---

# Define Glossaries with Contextive

## Context and Problem Statement

As complicated subsystem team it is part of our responsibility to become experts
for the domains related to the ERV (Elektronischen Rechtsverkehr). That includes
to learn the ubiquitous language and the specialized terminology. Maintaining
a glossary can help the Court Communication team itself, but also the other
teams. While trying to provide maximum value for the stream-aligned teams, we
won't be able to abstract away the full complexity of these domains. Hence, we
need to make it comprehensible for everyone, providing information highly
accessible.

How should we define and share our glossaries?

## Decision Drivers

- Writing glossaries should be effortless
- High accessibility and availability in daily work
- Shareable cross repository boundary for other teams
- Usable by coding agents

## Decision Outcome

Chosen option: "Contextive", because it uses plain YAML files to structure
glossaries along domain context, making them available in highly accessible
ways. So can developer get hints based on the domain terminology directly as
hints in their code editor. This is also available for other stream-aligned
teams. The Contextive project is extended, working on deeper integrations.

### Consequences

- Good, because the terminology can be written into a glossary without much effort
- Good, because it helps to share domain knowledge
- Good, because it makes glossaries directly available inside code editors
- Good, because the plain YAML is usable also without specialized tooling
- Neutral, because the glossary might not actually be used

### Confirmation

We will learn if the glossary integration is actually used by other teams too.
If the glossaries are always just written and never read, we might wanna sport
investing the effort. Also interesting to see if coding agents pick up the
terminology.
