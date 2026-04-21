---
status: approved
date: 2026-04-24
---

# Check Link Validity with Lychee

## Context and Problem Statement

We use various kinds of links cross the whole repository. We link to external
resources like websites. But there are also plenty of internal links, for
example between many documentation files, using relative paths as reference.
Over time, links "rot" and stop working. External sources can become unavailable
for endless reasons. But also internals links break over time without care. This
severely degrades the quality of documentation and leads to frustration.
To avoid this, we need automated checks for all links in the repository.

Which tool can we use to check for validity of links?

## Decision Drivers

- Capability to find links in basically any kind of file
- Support for local filesystem links as well as external links with various protocols
- Execution speed, because the codebase has to be checked as whole continuously
- Resilience against network issues like rate limiting and timeout issues

## Decision Outcome

Chosen option: "Lychee", because it is the best in class tool of this kind. It
is as fast as it gets to extract links from the codebase and verify them, fully
saturating the network resources if desired. Lychee has solid network resistance
mechanisms, which can be tweaked when necessary. Finally it fully understand
links in Markdown with references to other files including anchors by heading.

Lychee will have to run in at least three different scenarios. First of all, it
should be part of the quality assurance in the continuous integration pipeline.
Furthermore, it should be used in hooks of the version control system to test
for new links early. Finally, it is required to have Lychee run on a regular
bases as scheduled job to continuously monitor for link validity, also without
code changes. This is similar to vulnerability scanning.

### Consequences

- Good, because the quality of our documentation improves
- Good, because we detect early and automatically when remote links stop working
- Good, because we detect immediately when internals break
- Bad, because external links can still be flaky, causing noise
- Bad, because we'll have to maintain an ignore-list for stub and development links
