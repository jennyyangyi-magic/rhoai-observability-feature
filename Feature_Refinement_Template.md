# 🧩 Feature Refinement Template

**Document Name:** `FeatureRefinement - JIRA# - TITLE OF STRAT`

**Feature Jira Link:**\
*(Add link, e.g., XXXSTRAT-####)*

**Status:** Not started\
**Slack Channel / Thread:** *(Add link if applicable)*\
**Feature Owner:**\
**Delivery Owner:**\
**RFE Council Reviewer:**\
**Product:** *(RHOAI -- specify Managed or Self-Managed, RHAIIS, RHEL
AI)*

------------------------------------------------------------------------

## 1. Feature Overview

Describe the feature:\
- Who benefits (persona / user role)?\
- How it changes the current state?\
- Example user narrative: how and when the user would use this feature.

------------------------------------------------------------------------

## 2. The Why

Why are we doing this feature now?\
- What does it bring to the platform?\
- How does it help us win customers or support strategy?\
- What types of customers benefit?\
- What supporting data exists?\
- If assumptive, define clear success metrics for validation.

------------------------------------------------------------------------

## 3. High-Level Requirements

List key functionality for the **initial release** only.\
Use this format: \> As a \[user role\], I want \[capability\], so that
\[benefit\].

------------------------------------------------------------------------

## 4. Non-Functional Requirements

List considerations such as:\
- Performance expectations\
- Security requirements\
- Disconnected / air-gapped environments\
- User experience expectations\
- Upgrade or backward compatibility

------------------------------------------------------------------------

## 5. Out of Scope

List any areas explicitly **not** part of this release.

------------------------------------------------------------------------

## 6. Acceptance Criteria

Define "done."\
Use this format: \> Given \[context\], when \[action\], then \[expected
outcome\].

------------------------------------------------------------------------

## 7. Risks & Assumptions

-   **Risks:** Potential blockers or threats to success.\
-   **Assumptions:** Conditions believed true but requiring validation.

------------------------------------------------------------------------

## 8. Supporting Documentation

Link to any designs, workflows, wireframes, discovery notes, or
technical docs.

------------------------------------------------------------------------

## 9. Additional Clarifying Info

Any contextual details that would help delivery teams understand the
request.

------------------------------------------------------------------------

## 10. Prerequisites & Dependencies

### ODH / RHOAI Build Process

-   Will this feature onboard a new container image or component? **YES
    / NO**
    -   If yes, follow onboarding instructions and email
        `team-ai-core-platform@redhat.com`.

### License Validation

-   Will this feature bring in new upstream projects/sub-projects? **YES
    / NO**
    -   Prefer **Apache 2.0** license. If not, post justification in
        `forum-openshift-ai-architecture`.

### Accelerator / Package Support

-   Requires AIPCC team support? **YES / NO**
    -   If yes, see AIPCC-1 for cloning instructions and attach Epic to
        STRAT.\
    -   Identify which accelerators or new variants are impacted.

### Architecture Review

-   "requires_architecture_review" label present? **YES / NO**\
-   RFE indicates "Requires architecture review"? **YES / NO**
    -   If yes, review at **OpenShift AI Architecture Forum** before
        committing to solution design.

### Other Dependencies

List any other prerequisite work or teams required for delivery.

------------------------------------------------------------------------

## 11. High-Level Plan

  --------------------------------------------------------------------------------------------
  Team Involved           Start    Work My Team Will    Dependencies   T-Shirt   Approval /
                          Date     Deliver (Epic)                      Size      Comments
  ----------------------- -------- -------------------- -------------- --------- -------------
  team-ai-core-platform                                                          
  *(required)*                                                                   

                                                                                 
  --------------------------------------------------------------------------------------------

------------------------------------------------------------------------

## 12. How to Engage Docs & UXD

-   **Docs:**
    -   Add "Documentation" component to the feature.\
    -   Set *Product Documentation Required* = Yes.\
    -   Follow the [Docs Intake
        Process](https://docs.google.com/document/d/1G_LKipII0DMX3UxpkxVEpgM9Pk5tHcfZdvnkjn9E1mI/edit?tab=t.0).
-   **UXD:**
    -   Add "UXD" component and include team in the plan table.\
    -   Reach out to [Jenn Giardino](mailto:jgiardin@redhat.com) or
        [Beau Morley](mailto:bmorley@redhat.com).
