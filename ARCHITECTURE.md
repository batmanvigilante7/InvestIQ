# FolioAI Cognitive Architecture

**The Master System Blueprint**

> This document defines the physics of the FolioAI universe. Every module, every feature, every AI capability must align with what is written here. Read this before building anything.

---

## 1. Core Product Philosophy

FolioAI is not a stock recommendation platform.

It is not a portfolio tracker. It is not an AI chatbot. It is not a finance dashboard.

FolioAI is **cognitive investing infrastructure** designed to help investors:

- Structure beliefs into testable theses
- Track conviction as it evolves over time
- Analyze the quality of their own reasoning
- Surface behavioral blind spots they cannot see themselves
- Improve long-term decision-making under uncertainty

**The system augments decisions. It never replaces them.**

The user is always the decision-maker. FolioAI is the thinking partner that remembers everything, notices patterns, and asks the questions the investor forgot to ask.

---

## 2. System Principles

These are non-negotiable. Any module, feature, or AI behavior that violates these principles is wrong — regardless of how clever it seems.

| # | Principle | What It Means |
|---|-----------|---------------|
| 1 | **Everything revolves around theses** | A thesis is the atomic unit of investment thinking. No decision, signal, or portfolio position exists without one. |
| 2 | **Events affect assumptions** | Market events are only meaningful in the context of what the user believes. "Revenue up 14%" means nothing until mapped to an assumption. |
| 3 | **Conviction must be temporal** | Confidence is never a single number. It is a time series. When it changed matters as much as what it changed to. |
| 4 | **AI must explain reasoning** | No black boxes. Every AI output must be traceable to the data and logic that produced it. |
| 5 | **Intelligence > information** | The system does not deliver news. It delivers *meaning*. "Your margin expansion assumption weakened" — not "Revenue missed estimates." |
| 6 | **Behavioral awareness matters** | Investors are their own biggest risk. The system must track cognitive patterns, not just market data. |
| 7 | **User trust is sacred** | Investment reasoning is deeply personal. Data is never shared, never sold, never used against the user. |
| 8 | **The graph is the source of truth** | Not any single view, dashboard, or module. The unified investor graph is the canonical representation of everything the system knows. |

---

## 3. Canonical Objects

Every module in FolioAI speaks the same language. These are the **core primitives** — the shared entities that all modules read from and write to.

### 3.1 Entity Definitions

#### User
The investor. Has identity, preferences, behavioral profile, and a portfolio.

#### Thesis
A structured investment belief. The atomic unit of the system.

```
Thesis {
  id
  user_id
  title              // "Semiconductor cycle recovery"
  description        // Free-text reasoning
  status             // active | paused | retired | invalidated
  created_at
  updated_at
  tags               // sector, theme, geography
}
```

**Rule:** A thesis cannot exist without at least one assumption.

#### Assumption
A specific condition required for a thesis to hold true. Assumptions are testable.

```
Assumption {
  id
  thesis_id
  statement          // "AI capex will grow >30% YoY"
  category           // demand | supply | macro | regulatory | competitive
  status             // holding | weakening | invalidated | confirmed
  evidence_for       // linked signals
  evidence_against   // linked signals
  created_at
  last_evaluated_at
}
```

**Rule:** Every assumption must be evaluable. If you cannot tell whether it is holding or weakening, it is not an assumption — it is a wish.

#### Signal
A measurable indicator that validates or challenges an assumption.

```
Signal {
  id
  assumption_id
  source             // news | earnings | data_feed | user_input
  content            // raw content or summary
  direction          // supportive | contradicting | neutral
  strength           // weak | moderate | strong
  timestamp
}
```

#### Event
A market-moving development. Events are raw. Signals are interpreted.

```
Event {
  id
  title
  source
  category           // earnings | macro | regulatory | geopolitical | sector
  entities           // companies, sectors, themes involved
  timestamp
  raw_content
}
```

**Distinction:** An event is "Fed raises rates 25bps." A signal is "This weakens your rate-sensitive thesis on REITs."

#### Conviction
A temporal confidence measurement applied to a thesis.

```
Conviction {
  id
  thesis_id
  value              // 0-100
  reasoning          // why this level
  recorded_at
}
```

**Rule:** Conviction is always a time series, never a single point. The system stores every update.

#### Risk
A potential failure factor for a thesis or assumption.

```
Risk {
  id
  thesis_id          // or assumption_id
  description        // "Supply chain disruption in Taiwan"
  category           // macro | company | sector | behavioral
  severity           // low | medium | high | critical
  probability        // 0-1
  status             // active | materialized | mitigated
}
```

#### Decision
A user action (trade, rebalance, hold, exit) linked to a thesis.

```
Decision {
  id
  user_id
  thesis_id
  action             // buy | sell | hold | rebalance | exit
  asset
  quantity
  reasoning          // why now
  emotional_state    // calm | anxious | euphoric | fearful | neutral
  confidence_at_decision
  timestamp
}
```

**Rule:** Every decision must link to a thesis. No orphan trades.

#### Outcome
The result of a decision, evaluated after time passes.

```
Outcome {
  id
  decision_id
  thesis_id
  return_pct
  evaluated_at
  thesis_was_correct  // true | false | partial
  what_was_missed     // hindsight analysis
}
```

#### Narrative
A market-level story or theme that groups multiple theses.

```
Narrative {
  id
  title              // "AI Infrastructure Boom"
  description
  momentum           // accelerating | stable | weakening | exhausted
  crowdedness        // early | growing | crowded | consensus
  related_theses     // thesis_ids
  created_at
  last_updated_at
}
```

#### Portfolio
The user's current holdings, analyzed through the thesis lens.

```
Portfolio {
  user_id
  positions
  thesis_coverage     // % of holdings covered by active theses
  concentration_risk
  narrative_overlap
  uncovered_holdings  // positions with no thesis
}
```

### 3.2 Relationship Map (The Edges)

The entities above are nodes. The intelligence lives in the **edges** — the typed relationships between them.

```
Thesis        --[depends_on]------> Assumption
Assumption    --[validated_by]----> Signal
Signal        --[triggered_by]----> Event
Conviction    --[applies_to]------> Thesis
Decision      --[influenced_by]---> Conviction
Decision      --[targets]---------> Thesis
Outcome       --[tests]-----------> Assumption
Outcome       --[resulted_from]---> Decision
Narrative     --[contains]--------> Thesis
Risk          --[threatens]-------> Assumption
Portfolio     --[expresses]-------> Thesis
```

**This graph is the product.** The UI is a view into the graph. The AI is a traversal engine over the graph. The graph is the moat.

### 3.3 System Invariants

These rules must hold at all times, across all modules:

1. A **Thesis** cannot exist without at least one **Assumption**
2. **Conviction** is always temporal — never a single snapshot
3. Every **Decision** must link to a **Thesis** — no orphan trades
4. **Signals** are only meaningful in the context of an **Assumption**
5. Every **Assumption** must be evaluable — holding, weakening, or invalidated
6. **AI outputs** must always be explainable — traceable to data and logic
7. **Events** are raw data; **Signals** are interpretations — never confuse them
8. The **graph** is the source of truth, not any single view or module

---

## 4. Intelligence Flow

This is how the system thinks. Every module plugs into this pipeline at one or more stages.

### 4.1 The Reasoning Pipeline

```
External World
    │
    ▼
┌─────────────────┐
│  Event Capture  │  ← News, earnings, data feeds, macro releases
└────────┬────────┘
         ▼
┌─────────────────┐
│ Event Extraction │  ← AI extracts structured events from raw content
└────────┬────────┘
         ▼
┌─────────────────┐
│ Signal Mapping   │  ← Events mapped to user's assumptions
└────────┬────────┘
         ▼
┌─────────────────────┐
│ Thesis Impact Score  │  ← How much does this affect the thesis?
└────────┬────────────┘
         ▼
┌─────────────────────┐
│ Conviction Delta     │  ← Should confidence change?
└────────┬────────────┘
         ▼
┌─────────────────────┐
│ Portfolio Impact     │  ← What positions are affected?
└────────┬────────────┘
         ▼
┌─────────────────────┐
│ Risk Assessment      │  ← New risks? Existing risks materializing?
└────────┬────────────┘
         ▼
┌─────────────────────┐
│ User Intelligence    │  ← Alert, insight, or question for the user
└─────────────────────┘
```

### 4.2 Behavioral Intelligence Pipeline

Separate from market intelligence. Runs in parallel.

```
User Actions
    │
    ▼
┌──────────────────────┐
│ Decision Recording    │  ← What did they do? What was their state?
└────────┬─────────────┘
         ▼
┌──────────────────────┐
│ Pattern Detection     │  ← Recurring behaviors, biases, triggers
└────────┬─────────────┘
         ▼
┌──────────────────────┐
│ Behavioral Profile    │  ← Investor DNA — strengths, weaknesses, blind spots
└────────┬─────────────┘
         ▼
┌──────────────────────┐
│ Cognitive Risk Alert  │  ← "You historically increase risk during euphoric rallies"
└──────────────────────┘
```

---

## 5. Shared Intelligence Layer

These are reusable AI capabilities. Modules do NOT implement their own versions of these. They consume shared services.

| Capability | Description | Consumers |
|------------|-------------|-----------|
| **Event Extraction** | Parse raw news/data into structured Event objects | Signal Watchtower, Earnings Interpreter |
| **Assumption Mapping** | Link events to user assumptions | Signal Watchtower, Thesis Engine |
| **Conviction Scoring** | Calculate conviction deltas from evidence | Conviction Tracker, Thesis Engine |
| **Narrative Detection** | Identify and track market narratives | Narrative Radar |
| **Behavioral Analysis** | Detect cognitive patterns from decision history | Investor DNA, Cognitive Risk Alerts |
| **Risk Mapping** | Identify threats to assumptions and theses | Portfolio X-Ray, Assumption Stress Tester |
| **Thesis Quality Scoring** | Evaluate reasoning quality of theses | Thesis Journal, Decision Journal |
| **Contextual Interpretation** | Translate data into thesis-relevant meaning | Earnings Interpreter, Signal Watchtower |

**Rule:** If two modules need the same AI capability, it belongs in the shared layer. No duplication.

---

## 6. System Architecture

### 6.1 Philosophy

FolioAI is a **modular intelligence platform**.

- Modules are independently deployable
- Modules communicate through shared domain models and an event bus
- The investor graph is centralized and accessible by all modules
- Intelligence services are shared, not duplicated

### 6.2 Module Communication

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Module A    │  │   Module B    │  │   Module C    │
│ (Thesis Jrnl) │  │ (Signal Wtwr) │  │ (Conviction)  │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       ▼                 ▼                 ▼
┌─────────────────────────────────────────────────┐
│              Unified Investor Graph              │
│   (Theses, Assumptions, Signals, Convictions)   │
└────────────────────────┬────────────────────────┘
                         │
       ┌─────────────────┼─────────────────┐
       ▼                 ▼                 ▼
┌─────────────┐  ┌──────────────┐  ┌─────────────┐
│ Intelligence │  │  Event Bus   │  │  Behavioral  │
│   Services   │  │ (async msgs) │  │   Engine     │
└─────────────┘  └──────────────┘  └─────────────┘
```

### 6.3 Event-Driven Architecture

Modules emit events when significant things happen. Other modules subscribe to events they care about.

**Core Events:**

| Event | Emitter | Consumers |
|-------|---------|-----------|
| `thesis_created` | Thesis Journal | Signal Watchtower, Portfolio X-Ray |
| `assumption_added` | Thesis Journal | Signal Watchtower |
| `signal_detected` | Signal Watchtower | Thesis Engine, Conviction Tracker |
| `conviction_changed` | Conviction Tracker | Cognitive Risk Alerts |
| `decision_logged` | Decision Journal | Investor DNA, Outcome Tracker |
| `outcome_recorded` | Outcome Tracker | Investor DNA, Thesis Engine |
| `narrative_shifted` | Narrative Radar | Thesis Engine, Portfolio X-Ray |
| `risk_materialized` | Risk Engine | All active modules |

### 6.4 Data Ownership

Each entity has a single **owner module** — the module that creates and manages it. Other modules read but do not write.

| Entity | Owner Module |
|--------|-------------|
| Thesis | Thesis Journal |
| Assumption | Thesis Journal |
| Signal | Signal Watchtower |
| Event | Signal Watchtower |
| Conviction | Conviction Tracker |
| Decision | Decision Journal |
| Outcome | Decision Journal |
| Narrative | Narrative Radar |
| Risk | Portfolio X-Ray |
| Behavioral Profile | Investor DNA |

---

## 7. Module Contracts

Every module must define its boundaries before development begins.

### 7.1 Contract Template

```yaml
module:
  name: <module_name>
  purpose: <one sentence>
  
reads:
  - <entities this module consumes>
  
writes:
  - <entities this module creates/updates>
  
emits:
  - <events this module publishes>
  
subscribes:
  - <events this module listens to>
  
intelligence:
  - <shared AI services this module uses>
  
depends_on:
  - <other modules required>
```

### 7.2 Module 1 — Thesis Journal

```yaml
module:
  name: Thesis Journal
  purpose: Capture and structure investment reasoning into testable theses

reads:
  - User
  - Outcome (for thesis quality feedback)

writes:
  - Thesis
  - Assumption

emits:
  - thesis_created
  - thesis_updated
  - thesis_retired
  - assumption_added
  - assumption_modified

subscribes:
  - outcome_recorded (to show thesis accuracy over time)

intelligence:
  - Thesis Quality Scoring (feedback on reasoning quality)

depends_on:
  - Authentication
  - Unified Graph
```

### 7.3 Module 2 — Conviction Tracker

```yaml
module:
  name: Conviction Tracker
  purpose: Track how confidence in theses evolves over time

reads:
  - Thesis
  - User
  - Decision (to correlate confidence with actions)

writes:
  - Conviction

emits:
  - conviction_changed
  - conviction_trend_detected

subscribes:
  - thesis_created
  - signal_detected (to prompt confidence reassessment)

intelligence:
  - Conviction Scoring

depends_on:
  - Thesis Journal
  - Unified Graph
```

### 7.4 Module 3 — Signal Watchtower

```yaml
module:
  name: Signal Watchtower
  purpose: Monitor external events and map them to user assumptions

reads:
  - Thesis
  - Assumption
  - User (for watchlist, themes, preferences)

writes:
  - Event
  - Signal

emits:
  - signal_detected
  - event_captured
  - assumption_validated
  - assumption_weakened

subscribes:
  - thesis_created
  - assumption_added

intelligence:
  - Event Extraction
  - Assumption Mapping

depends_on:
  - Thesis Journal
  - News/Data Feeds
  - Unified Graph
```

---

## 8. UX Philosophy

The user does not see the graph. They see language. That language must be consistent across every module.

### 8.1 Translation Table

| Internal Concept | User-Facing Language |
|-----------------|---------------------|
| Assumption weakening | "Something important changed" |
| Assumption invalidated | "A key belief was challenged" |
| Conviction delta | "Your confidence shifted" |
| Signal detected | "Something worth watching" |
| Thesis quality score | "Strength of this thinking" |
| Behavioral pattern | "Your tendency" |
| Cognitive bias detected | "Something to be aware of" |
| Narrative shift | "The story is changing" |
| Risk materialized | "A risk you flagged is happening" |
| Orphan position | "This holding has no thesis" |

### 8.2 Design Principles

1. **Show meaning, not data.** "Revenue up 14%" is data. "Your margin expansion assumption strengthened" is meaning.
2. **Ask questions, don't give lectures.** "Did this change your conviction?" is better than "Conviction analysis shows..."
3. **Respect the user's intelligence.** Don't oversimplify. Investors want to think, not be told.
4. **Make the invisible visible.** The user's own patterns are the hardest to see. Surface them gently but clearly.
5. **Every screen should answer: "What should I think about right now?"**

---

## 9. Evolution Roadmap

### Phase 1 — Thesis Intelligence
**Modules:** Thesis Journal, Conviction Tracker, Signal Watchtower
**Goal:** Capture beliefs, track confidence, surface relevant events
**Graph grows:** Theses → Assumptions → Signals → Conviction time series

### Phase 2 — Behavioral Intelligence
**Modules:** Decision Journal, Investor DNA, Cognitive Risk Alerts
**Goal:** Understand the investor as a decision-maker
**Graph grows:** Decisions → Outcomes → Behavioral patterns → Cognitive profile

### Phase 3 — Portfolio Cognition
**Modules:** Portfolio X-Ray, Assumption Stress Tester
**Goal:** Connect theses to real positions, reveal hidden risks
**Graph grows:** Portfolio → Thesis coverage → Concentration → Scenario modeling

### Phase 4 — Autonomous Cognition
**Modules:** Narrative Radar, Earnings Interpreter, Autonomous Governance
**Goal:** System becomes proactive — surfaces insights before the user asks
**Graph grows:** Narratives → Cross-thesis patterns → Predictive signals

### Phase 5 — Financial Second Brain
**Goal:** Unified investor graph becomes the product. The system understands your beliefs, behavior, portfolio, and the market better than you do. Not by being smarter — by remembering everything.

---

## 10. The FolioAI Constitution

A one-page summary of what is sacred.

### Truths
- The thesis is the atom. Everything else orbits it.
- Conviction is a river, not a lake. It must flow.
- Events are noise until mapped to beliefs. Then they are signal.
- The user is the decision-maker. The system is the thinking partner.
- Intelligence means meaning, not volume.
- Behavioral self-awareness is the ultimate edge.

### Invariants
- No thesis without assumptions.
- No conviction without history.
- No decision without a thesis.
- No signal without context.
- No black boxes.
- No orphan positions.

### Promises
- Your data is yours. Always.
- The system will never sell you anything.
- Every AI output is explainable.
- The graph tells the truth, even when it is uncomfortable.

---

*This document is the foundation. Every module, every feature, every line of code must align with it. When in doubt, return here.*
