---
status: accepted
date: 2026-06-29
decision-makers: Thore Straßburg, Pram Gurusinga
---

# Test Properties with Fast-Check

## Context and Problem Statement

To improve the reliability of our test suite and cover better against bugs by
edge-cases, we want to adopt property-based testing. Producing arbitrary input
data, we can verify that our invariants hold true. This helps us gaining more
trust in our implementations with adequate test cases.

Which solution should we choose to implement property-bases tests?

## Decision Outcome

Chosen option: "fast-check", because it is currently the only actively maintained
library with production grade for the TypeScript ecosystem. The team has good
experience with it

### Consequences

- Good, because we can adopt property-based testing.
- Good, because a rich test of random generators are provided.
- Good, because the shrinking features works solid and helps fixing bugs.
- Neutral, because the property-based testing isn't known by every software engineer.
- Neutral, because there is an integration with the used Vitest test harness.
