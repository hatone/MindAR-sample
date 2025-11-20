# Codex Execution Plans (ExecPlans) for the MindAR + Three.js AR project

This document defines the format and expectations for ExecPlans: self-contained design + execution documents that a coding agent or human can follow to ship a working feature in this repository.

ExecPlans should be detailed enough that someone unfamiliar with this codebase, given only the current working tree and a single ExecPlan, can implement the described behavior end‑to‑end.

If this file lives at `.agent/PLANS.md`, every ExecPlan in this repo must follow it.

---

## 1. How ExecPlans are used

There are three main ways to interact with ExecPlans:

1. **Authoring an ExecPlan**

   - Read this entire `PLANS.md` before writing a new plan.
   - Start from the skeleton in this file and fill it out as you study the code and requirements.
   - Make the plan self-contained: do not assume any prior ExecPlan or external docs are available.

2. **Implementing an ExecPlan**

   - Follow the plan step by step, without asking the user for “what next” unless the plan explicitly says so.
   - Keep the plan updated as you work:
     - Add entries under `Progress`.
     - Record surprises, design decisions, and changes of direction in the dedicated sections.
   - When you reach a stopping point, the plan must still be internally consistent and executable.

3. **Discussing or revising an ExecPlan**

   - Treat ExecPlans as living documents. When you learn something new, update the relevant sections.
   - For every design decision or pivot, write an entry in `Decision Log`.
   - At major milestones or completion, summarize in `Outcomes & Retrospective`.

---

## 2. Repo context: AR door overlay with MindAR + Three.js

This project is focused on a simple but complete WebAR experience:

- Use **MindAR** (image tracking variant for Three.js) to detect a specific door image `IMG_0116.jpg`.
- Use **Three.js** to render an overlay with the text `"Sample Text"` anchored on the detected door.
- Typical environment:
  - Web application running in a modern browser (mobile or desktop) with camera access.
  - A compiled MindAR image target file (e.g. `public/targets/door.mind`) generated from `IMG_0116.jpg`.

ExecPlans must assume that the reader does **not** know MindAR or Three.js. When you rely on those libraries, briefly explain the relevant parts in plain language and mention the files where the integration happens.

---

## 3. Non‑negotiable requirements

Every ExecPlan in this repo must satisfy these rules:

1. **Self-contained**

   - The ExecPlan must contain all the knowledge and instructions required to implement the feature.
   - Do not assume the reader has seen previous ExecPlans or external documentation.
   - If you need to reuse information from another ExecPlan, summarize the relevant parts here.

2. **Living document**

   - ExecPlans must be kept in sync with reality as work proceeds.
   - `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` are mandatory and must be updated.
   - A partially completed plan must still be coherent: it should be possible to resume from the current version.

3. **Beginner‑friendly**

   - Assume the implementer is new to this repository and to WebAR in general.
   - Define any non-obvious term (e.g. “anchor”, “image target”, “render loop”) the first time you use it.
   - Prefer descriptive sentences over dense jargon.

4. **Behavior‑first**

   - The goal of an ExecPlan is not “change some files”, but to make a user-visible behavior demonstrably work.
   - Start by stating what someone can do after the change (e.g. “point the camera at `IMG_0116.jpg` and see `"Sample Text"` glued to the door”).
   - Include precise instructions on how to run, observe, and verify the behavior.

5. **No external dependencies on docs**

   - Do not rely on external blog posts or documentation being available at execution time.
   - You may mention where ideas came from, but the information needed to implement must be present in the plan itself.

---

## 4. Formatting rules

ExecPlans follow a strict, predictable structure so that tools and humans can parse them easily.

- **Envelope when used with agents**

  - When sending an ExecPlan to an agent inside a prompt, wrap the entire plan in a single fenced code block labeled `md`:

        ```md
        ... entire ExecPlan content ...
        ```

  - Do not use additional triple-backtick fences **inside** that block. For code, commands, and diffs, use indented blocks.

- **When stored as a file**

  - ExecPlan files in the repository (for example `.agent/door-overlay-execplan.md`) **must not** include the outer triple-backtick fence.
  - The file contents should start directly with `# <Title>`.

- **Headings and spacing**

  - Use `#`, `##`, `###` with standard Markdown semantics.
  - Leave a blank line after each heading and between paragraphs.
  - Use lists sparingly; narrative text is preferred except where otherwise noted.

- **The `Progress` section**

  - `Progress` is the only section where checklists are required.
  - Each item should include:
    - A checkbox (`- [ ]` or `- [x]`).
    - A UTC timestamp.
    - A short description.
  - This section must always match the current state of the work.

---

## 5. Narrative guidelines

To keep ExecPlans readable and robust:

- **Explain terms immediately**

  - If you say “anchor”, briefly clarify that in MindAR this is an object linked to a detected image target, and that Three.js meshes attached to the anchor move with the target.
  - If you say “render loop”, explain that it is the per-frame function that updates the scene and instructs Three.js to draw it.

- **Favor observable outcomes**

  - Instead of saying “add a `DoorOverlay` class”, describe what a user sees:
    - “After these changes, pointing the camera at `IMG_0116.jpg` shows `"Sample Text"` glued to the door, staying fixed while you move the device.”

- **Be explicit about files and locations**

  - Use repository-relative paths (e.g. `src/main.ts`, `public/targets/door.mind`).
  - When modifying a function, mention its name and roughly where it lives (“in `src/ar/doorOverlay.ts`, edit `createDoorOverlay()`”).

- **Aim for idempotent steps**

  - Steps should be safe to repeat (e.g. re-running asset build commands, reapplying configuration).
  - If a step can fail halfway (e.g. asset compilation), describe how to recover.

- **Avoid underspecification**

  - Do not leave key decisions to the implementer (“pick any AR library” is not acceptable; this repo uses MindAR + Three.js).
  - When there are trade-offs (e.g. text rendering options), pick one and briefly explain why.

---

## 6. Milestones and `Progress`

**Milestones** are narrative chunks of work that each produce a verifiable piece of behavior.  
**Progress** is the granular checklist of what has actually been done so far.

For milestones:

- Give each milestone:
  - A short title.
  - A paragraph describing what will exist at the end that did not exist before.
  - High-level steps involved.
  - How to test and verify the milestone outcome.

Examples of milestones for the door overlay feature:

- “Compile MindAR target from `IMG_0116.jpg` and wire basic MindAR + Three.js scene.”
- “Attach `"Sample Text"` overlay to the door anchor and ensure correct alignment.”
- “Cross-device testing and visual adjustments for stability.”

For the `Progress` section:

- Use a checklist with timestamps, like:

      - [x] (2025-11-20 09:15Z) Generated `door.mind` from `IMG_0116.jpg` and added it to `public/targets/`.
      - [ ] (2025-11-20 10:05Z) Hooked up MindARThree instance and verified that the door target is detected.
      - [ ] (2025-11-20 11:30Z) Implemented and tuned the `"Sample Text"` overlay.

- Split items as needed when work is only partially complete.

---

## 7. Required “living” sections

Every ExecPlan **must** contain the following sections and keep them updated:

1. **Progress**

   - Checklist of granular steps with timestamps and completion state.

2. **Surprises & Discoveries**

   - Record unexpected behaviors, bugs, performance findings, or library quirks.
   - Include short evidence snippets (logs, console output, screenshots described in text).

3. **Decision Log**

   - For each meaningful decision:
     - Brief description.
     - Rationale.
     - Date and author (e.g. `2025-11-20 / gpt-5.1-codex`).

4. **Outcomes & Retrospective**

   - At major milestones or at completion, summarize:
     - What was achieved.
     - What remains open.
     - What you would do differently next time.

---

## 8. Prototyping and spikes

When facing uncertainty (e.g. library behavior, performance constraints, or alternative design options), it is appropriate to add dedicated prototyping milestones.

- Clearly label such milestones as **Prototype** in the title.
- Describe:
  - What question the prototype is trying to answer.
  - How to run it.
  - What evidence to collect (e.g. frame rate, tracking stability on `IMG_0116.jpg`).
- Define criteria to promote or discard the prototype.
- Keep prototypes additive and easy to remove later.

---

## 9. Skeleton of an ExecPlan

Use the following skeleton when writing a new ExecPlan.  
(If you are creating a plan specifically for the door overlay feature, you may keep the example wording and adapt as needed.)

    # Add door image overlay using MindAR + Three.js

    This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`,
    `Decision Log`, and `Outcomes & Retrospective` must be maintained as work proceeds.

    This plan MUST follow the rules described in `.agent/PLANS.md`.

    ## Purpose / Big Picture

    Explain in a few sentences what the user gains after this change and how to see it working.
    For example: "When a user opens the app on a phone and points the camera at `IMG_0116.jpg`,
    the text \"Sample Text\" appears stably over the door and moves correctly with the camera."

    ## Progress

    Use a checklist with timestamps. Keep it in sync with reality.

    - [ ] (YYYY-MM-DD hh:mmZ) Initial repo scan and understanding of current AR setup.
    - [ ] (YYYY-MM-DD hh:mmZ) Generated `door.mind` from `IMG_0116.jpg` and added it to the project.
    - [ ] (YYYY-MM-DD hh:mmZ) Integrated MindARThree and basic Three.js scene.
    - [ ] (YYYY-MM-DD hh:mmZ) Implemented `"Sample Text"` overlay anchored to the door target.
    - [ ] (YYYY-MM-DD hh:mmZ) Tested on at least one mobile device and one desktop browser.

    ## Surprises & Discoveries

    Document unexpected behaviors, library quirks, or optimizations.

    - Observation: ...
      Evidence: ...

    ## Decision Log

    Record each design decision.

    - Decision: ...
      Rationale: ...
      Date/Author: ...

    ## Outcomes & Retrospective

    Summarize what was achieved relative to the Purpose.
    Note any gaps or follow-up work and lessons learned.

    ## Context and Orientation

    Describe the current state of the repo relevant to this task as if the reader knows nothing.

    - Where the entry point is (e.g. `index.html`, `src/main.ts`).
    - Where AR setup currently lives (or that it does not yet exist).
    - Where assets like `IMG_0116.jpg` and `door.mind` are stored.
    - Any existing MindAR or Three.js code and how it is wired.

    Define key terms here: "image target", "anchor", "render loop", etc.

    ## Plan of Work

    In prose, describe the sequence of edits and additions.

    - Which files to create (e.g. `src/ar/doorOverlay.ts`).
    - Which files to modify.
    - Rough description of what each edit will accomplish.

    Keep this high-level but concrete enough that a novice can follow it file by file.

    ## Concrete Steps

    Provide exact commands and actions, including working directories.

    Examples:

    - Install dependencies (if needed):

          npm install mind-ar three

    - Build or start the dev server:

          npm run dev

    - Asset preparation:

          # Describe how `door.mind` was generated from `IMG_0116.jpg`
          # (e.g., via MindAR's CLI or GUI tooling) and where the file is stored.

    For each command, show a short expected output or description
    so the reader can tell success from failure.

    ## Validation and Acceptance

    Describe how to manually verify that the feature works.

    Example for this project:

    - Start the app locally (command from "Concrete Steps").
    - Open it on a device with a camera.
    - Point the camera at a printout or screen showing `IMG_0116.jpg`.
    - Acceptance criteria:
      - The camera feed is visible.
      - The app detects the door image and creates an anchor.
      - The text `"Sample Text"` appears aligned with the door and remains stable as the camera moves.

    If tests exist, specify how to run them and what a successful run looks like.

    ## Idempotence and Recovery

    Note which steps can safely be repeated (e.g. re-generating `door.mind`,
    re-running asset build commands) and how to recover from partial failures
    (e.g. cleaning build artifacts, resetting configuration).

    ## Artifacts and Notes

    Include small but important snippets to make future work easier:

    - Key configuration fragments.
    - Example log lines showing successful target detection.
    - Short code excerpts that are especially tricky.

    Keep these snippets concise and relevant.

    ## Interfaces and Dependencies

    Be explicit about libraries, modules, and public interfaces:

    - MindAR integration:
      - How `MindARThree` is instantiated (which options are used, where the call lives).
      - How `imageTargetSrc` is configured to point to `door.mind`.
    - Three.js integration:
      - How the scene, camera, and renderer are created.
      - How the overlay text is implemented (e.g., texture on a plane, text mesh).
    - Exposed functions or classes:
      - Names and responsibilities (e.g. `startDoorOverlayExperience()`).
      - How they are used by the rest of the app.

    The goal is that, by the end of this section, a future contributor
    can confidently reuse or extend the feature without re-reading the entire plan.

---

If you follow this `PLANS.md` when creating ExecPlans, a single stateless agent — or a human who has never seen this repository before — should be able to read an ExecPlan from top to bottom and produce the intended AR behavior, including the `"Sample Text"` door overlay.