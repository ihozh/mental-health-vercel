---
title: "The ABCD in Multimodal Intrapersonal and Interpersonal Dynamics (MIND)"
date: "2026-04-05"
tag: "CLPsych"
excerpt: "A walkthrough of the ABCD annotation framework (Affect, Behavior, Cognition, and Desire) that sits at the heart of the MIND taxonomy for analysing mental-health language."
---

## What is ABCD?

**ABCD** is a theory-grounded annotation framework used within the **Multimodal Intrapersonal and Interpersonal Dynamics (MIND)** taxonomy. It captures four core psychological dimensions that clinicians attend to when reading a patient's written or spoken language:

| Dimension | Full name | Focus |
|-----------|-----------|-------|
| **A** | Affect | Emotions the writer *feels* |
| **B** | Behavior | Actions the writer *takes* (toward others or self) |
| **C** | Cognition | Perceptions the writer *holds* (of others or self) |
| **D** | Desire | Underlying needs, intentions, or fears |

Each dimension is further split along two axes:

- **Intra- vs Interpersonal**: B and C each have a *Self* variant (B-S, C-S) and an *Other* variant (B-O, C-O), reflecting whether the psychological content is directed inward or outward.
- **Adaptive vs Maladaptive**: every sub-category is coded as either *adaptive* (healthy, functional) or *maladaptive* (distressed, dysfunctional).

The full schema therefore yields **six annotation dimensions**: A, B-O, B-S, C-O, C-S, D.

---

## A: Affect

Affect captures the **type of emotion** expressed by the writer. It is the most granular dimension, with 14 distinct sub-categories.

### Adaptive affect

| Code | Label |
|------|-------|
| A-1 | Calm, laid back |
| A-3 | Sad, emotional pain, grieving |
| A-5 | Content, happy, joyful, hopeful |
| A-7 | Vigorous, energetic |
| A-9 | Justifiable anger, assertive anger, justifiable outrage |
| A-11 | Proud |
| A-13 | Feeling loved, sense of belonging |

> **Note on A-3:** Sadness and grief are coded as *adaptive* when they are proportionate to circumstances (e.g. mourning a loss), rather than pervasive and disconnected from any trigger.

### Maladaptive affect

| Code | Label |
|------|-------|
| A-2 | Anxious, fearful, tense |
| A-4 | Depressed, despairing, hopeless |
| A-6 | Manic |
| A-8 | Apathetic, blunted, emotionally flat |
| A-10 | Aggression, disgust, contempt |
| A-12 | Ashamed, guilty |
| A-14 | Lonely |

The odd/even numbering is intentional: odd codes are adaptive, even codes are maladaptive, making the pairing visually explicit in annotations.

---

## B: Behavior

Behavior captures **what the writer does**: actions rather than feelings or thoughts. It splits into two sub-dimensions depending on the target of the action.

### B-O: Behavior toward Others

| Code | Label | Adaptive? |
|------|-------|-----------|
| B-O-1 | Relating behavior | Adaptive |
| B-O-2 | Fight or flight behavior | Maladaptive |
| B-O-3 | Autonomous or adaptive control behavior | Adaptive |
| B-O-4 | Over-controlled or controlling behavior | Maladaptive |

*Relating behavior* (B-O-1) encompasses warmth, cooperation, and healthy connection. Its maladaptive mirror, B-O-2, covers aggression, withdrawal, or avoidance when facing interpersonal stress.

*Autonomous control behavior* (B-O-3) reflects healthy boundary-setting and self-direction in relationships; B-O-4 flips this into rigidity or coercive control.

### B-S: Behavior toward Self

| Code | Label | Adaptive? |
|------|-------|-----------|
| B-S-1 | Self-care and self-improvement | Adaptive |
| B-S-2 | Self-harm, neglect, and avoidance | Maladaptive |

This dimension collapses to a single adaptive/maladaptive pair because the relevant behavioral space is narrower when the actor and target are the same person: either the writer is taking care of themselves, or they are not.

---

## C: Cognition

Cognition captures **how the writer perceives** their world: the mental representations they hold rather than the emotions they feel or the actions they take. Like Behavior, it splits into an Other-directed and a Self-directed variant.

### C-O: Cognition toward Others

| Code | Label | Adaptive? |
|------|-------|-----------|
| C-O-1 | Perception of the other as related (connected, caring) | Adaptive |
| C-O-2 | Perception of the other as detached or over-attached | Maladaptive |
| C-O-3 | Perception of the other as facilitating autonomy needs | Adaptive |
| C-O-4 | Perception of the other as blocking autonomy needs | Maladaptive |

C-O mirrors the structure of B-O: both dimensions are organised around the twin psychological needs of *relatedness* and *autonomy*, a pattern that will resurface in D.

### C-S: Cognition toward Self

| Code | Label | Adaptive? |
|------|-------|-----------|
| C-S-1 | Self-acceptance and self-compassion | Adaptive |
| C-S-2 | Self-criticism | Maladaptive |

A writer high in C-S-2 might describe themselves as worthless, fundamentally broken, or undeserving of care: internal narratives that clinical approaches such as CFT and CBT directly target.

---

## D: Desire

Desire captures the writer's **underlying motivation**: the need, expectation, intention, or fear that drives the psychological content in a passage.

### Adaptive desires (needs the writer expects to meet)

| Code | Label |
|------|-------|
| D-1 | Relatedness |
| D-3 | Autonomy and adaptive control |
| D-5 | Competence, self-esteem, self-care |

These three map cleanly onto **Self-Determination Theory's** three basic psychological needs: *relatedness*, *autonomy*, and *competence*.

### Maladaptive desires (needs the writer fears will not be met)

| Code | Label |
|------|-------|
| D-2 | Expectation that relatedness needs will not be met |
| D-4 | Expectation that autonomy needs will not be met |
| D-6 | Expectation that competence needs will not be met |

The maladaptive Desire codes are not simply "wanting bad things": they are *thwarted* versions of the same healthy needs. A writer coded D-2 still *wants* connection; they simply do not believe they will ever have it.

---

## The Full ABCD Picture

Putting it all together, a single annotated passage might receive codes across multiple dimensions simultaneously:

> *"I don't know why I even try. Nobody cares about me anyway, and I can't seem to do anything right."*

A possible annotation:

| Dimension | Code | Label |
|-----------|------|-------|
| A | A-4 | Depressed, hopeless |
| A | A-14 | Lonely |
| B-S | B-S-2 | Self-harm / neglect / avoidance (giving up) |
| C-O | C-O-2 | Perception of others as detached |
| C-S | C-S-2 | Self-criticism |
| D | D-2 | Expectation that relatedness needs will not be met |
| D | D-6 | Expectation that competence needs will not be met |

The richness of this multi-label representation is what makes ABCD well-suited to NLP tasks that go beyond binary distress detection: it supports fine-grained triage, progress tracking, and interpretable model outputs.

---

## Why ABCD Matters for Computational Work

Classical mental-health NLP relies heavily on keyword lists and binary sentiment. ABCD offers three advantages:

1. **Theory grounding**: every label traces back to established clinical constructs (SDT, attachment theory, CBT/CFT), making the taxonomy interpretable to practitioners.
2. **Adaptive/maladaptive distinction**: the same surface emotion (e.g. anger) can be healthy (A-9) or harmful (A-10) depending on context; models trained on ABCD must capture this nuance.
3. **Multi-dimensionality**: a passage can simultaneously carry affect, behavioral, cognitive, and motivational signals, enabling richer downstream tasks such as treatment matching or longitudinal change detection.

Future posts will show how we operationalise ABCD labels in the CLPsych shared task and what NLP architectures best recover each dimension.
