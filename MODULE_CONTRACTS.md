# FolioAI Module Contracts

**The Glue That Prevents Chaos**

> Every module must have a formal contract before a single line of code is written. This document defines what each module does, what it touches, and how it communicates. A builder working on one module should be able to read only that module's contract and build correctly.

---

## Contract Template

Every module contract follows this structure:

```yaml
module:
  name: <module_name>
  purpose: <one sentence — what this module exists to do>

responsibilities:
  owns:    <what this module is solely responsible for>
  does_not_own: <what explicitly belongs to other modules>

reads:
  - entity: <name>
    access: read | read/write
    reason: <why this module needs it>

writes:
  - entity: <name>
    fields: <which fields this module creates/updates>

emits:
  - event: <event_name>
    when: <what triggers this event>
    payload: <what data is attached>

subscribes:
  - event: <event_name>
    action: <what this module does when it receives the event>

intelligence:
  - capability: <shared AI service>
    purpose: <what this module uses it for>

depends_on:
  - <module or infrastructure dependency>

failure_conditions:
  - scenario: <what can go wrong>
    behavior: <how this module handles it>
```

---

## Module 1 — Thesis Journal

### Purpose

Capture and structure investment reasoning into testable theses with explicit assumptions.

### Responsibilities

| Owns | Does NOT Own |
|------|-------------|
| Thesis creation and lifecycle | Conviction tracking |
| Assumption definition | Signal monitoring |
| Thesis quality feedback | Portfolio mapping |
| Reasoning structure | Outcome evaluation |

### Reads

| Entity | Access | Reason |
|--------|--------|--------|
| User | Read | Identity, preferences |
| Outcome | Read | Show thesis accuracy over time |

### Writes

| Entity | Fields |
|--------|--------|
| Thesis | title, description, status, tags, created_at, updated_at |
| Assumption | statement, category, status, created_at, last_evaluated_at |

### Emits

| Event | When | Payload |
|-------|------|---------|
| `thesis_created` | New thesis saved | thesis_id, user_id, tags |
| `thesis_updated` | Thesis edited | thesis_id, changed_fields |
| `thesis_retired` | User retires thesis | thesis_id, reason |
| `assumption_added` | New assumption attached | assumption_id, thesis_id, statement |
| `assumption_modified` | Assumption edited | assumption_id, changed_fields |
| `assumption_status_changed` | Assumption marked weakening/invalidated | assumption_id, old_status, new_status |

### Subscribes

| Event | Action |
|-------|--------|
| `outcome_recorded` | Display thesis accuracy; highlight what was missed |
| `signal_detected` | Show related signals on thesis view |

### Intelligence

| Capability | Purpose |
|------------|---------|
| Thesis Quality Scoring | Evaluate reasoning strength — flag vague assumptions, missing evidence, logical gaps |

### Dependencies

- Authentication service
- Unified Investor Graph
- Shared AI services

### Failure Conditions

| Scenario | Behavior |
|----------|----------|
| User deletes a thesis | Archive it. Preserve all linked assumptions, signals, convictions for historical analysis. Never hard-delete. |
| Assumption becomes unmeasurable | Flag it. Prompt user to reformulate or retire. |
| User creates thesis with no assumptions | Block creation. Enforce invariant: thesis requires ≥1 assumption. |

---

## Module 2 — Conviction Tracker

### Purpose

Track how investor confidence in theses evolves over time. Surface patterns in conviction behavior.

### Responsibilities

| Owns | Does NOT Own |
|------|-------------|
| Conviction history | Thesis content |
| Confidence delta calculation | Signal interpretation |
| Conviction trend detection | Behavioral profiling |
| Temporal conviction storage | Decision logging |

### Reads

| Entity | Access | Reason |
|--------|--------|--------|
| Thesis | Read | Context for conviction |
| User | Read | Identity |
| Decision | Read | Correlate confidence with actions |
| Signal | Read | Prompt conviction reassessment |

### Writes

| Entity | Fields |
|--------|--------|
| Conviction | thesis_id, value (0-100), reasoning, recorded_at |

### Emits

| Event | When | Payload |
|-------|------|---------|
| `conviction_changed` | User updates confidence | conviction_id, thesis_id, old_value, new_value, delta |
| `conviction_dropped` | Confidence falls below threshold | thesis_id, current_value, drop_amount |
| `conviction_spike_detected` | Unusual confidence jump | thesis_id, old_value, new_value, velocity |
| `conviction_trend_detected` | Sustained directional movement | thesis_id, direction, duration, magnitude |

### Subscribes

| Event | Action |
|-------|--------|
| `thesis_created` | Initialize conviction record |
| `signal_detected` | Prompt user: "Did this change your confidence?" |
| `assumption_status_changed` | Flag conviction may need updating |

### Intelligence

| Capability | Purpose |
|------------|---------|
| Conviction Scoring | Calculate conviction deltas from evidence strength |
| Trend Analysis | Detect sustained conviction patterns |
| Sentiment Analysis | Analyze emotional tone of conviction notes |

### Dependencies

- Thesis Journal (requires theses to exist)
- Unified Investor Graph

### Failure Conditions

| Scenario | Behavior |
|----------|----------|
| Thesis deleted | Archive conviction history. Preserve temporal record. |
| No conviction updates for extended period | Gentle prompt: "It's been 30 days. Has anything changed?" |
| Extreme conviction swing (>40 points in <24 hours) | Flag for cognitive risk engine. Possible emotional decision. |

---

## Module 3 — Signal Watchtower

### Purpose

Continuously monitor market events and map them to user assumptions. This is the retention anchor — it pulls users back by surfacing relevant intelligence.

### Responsibilities

| Owns | Does NOT Own |
|------|-------------|
| Event extraction from news/data | Thesis interpretation |
| Signal creation and classification | Conviction updates |
| Assumption mapping | Portfolio analysis |
| Event-to-signal pipeline | Narrative detection |

### Reads

| Entity | Access | Reason |
|--------|--------|--------|
| Thesis | Read | Know what user believes |
| Assumption | Read | Know what to validate/contradict |
| User | Read | Watchlist, themes, sector preferences |
| Portfolio | Read | Prioritize signals by position impact |

### Writes

| Entity | Fields |
|--------|--------|
| Event | title, source, category, entities, timestamp, raw_content |
| Signal | assumption_id, source, content, direction, strength, timestamp |

### Emits

| Event | When | Payload |
|-------|------|---------|
| `signal_detected` | New signal mapped to assumption | signal_id, assumption_id, thesis_id, direction, strength |
| `event_captured` | Raw event extracted | event_id, category, entities |
| `assumption_validated` | Signal supports assumption | assumption_id, signal_id |
| `assumption_weakened` | Signal contradicts assumption | assumption_id, signal_id, severity |
| `thesis_strengthened` | Multiple supporting signals | thesis_id, signal_count |
| `thesis_weakened` | Multiple contradicting signals | thesis_id, signal_count, severity |
| `macro_risk_detected` | Broad market risk identified | risk_type, affected_theses |

### Subscribes

| Event | Action |
|-------|--------|
| `thesis_created` | Start monitoring related entities/events |
| `assumption_added` | Add to watchlist for signal mapping |
| `portfolio_changed` | Re-prioritize signal monitoring by position size |

### Intelligence

| Capability | Purpose |
|------------|---------|
| Event Extraction | Parse raw news/data feeds into structured Event objects |
| Entity Resolution | Match events to companies, sectors, themes |
| Assumption Mapping | Link events to specific user assumptions |
| Sentiment Classification | Determine if signal is supportive, contradicting, or neutral |

### Dependencies

- Thesis Journal (requires theses and assumptions)
- News/data feed integrations
- Unified Investor Graph
- Shared AI services (Event Extraction, Assumption Mapping)

### Failure Conditions

| Scenario | Behavior |
|----------|----------|
| No theses exist for user | Do nothing. Wait. Prompt user to create first thesis. |
| Event cannot be mapped to any assumption | Store as unmapped event. Surface as "general market intelligence." |
| Data feed unavailable | Queue and retry. Notify user of monitoring gap if >1 hour. |
| Signal volume overwhelming | Prioritize by portfolio impact and assumption criticality. Throttle notifications. |

---

## Module 4 — Decision Journal

### Purpose

Track WHY decisions were made, not just what was done. Capture emotional state, reasoning, and context at the moment of decision.

### Responsibilities

| Owns | Does NOT Own |
|------|-------------|
| Decision logging | Outcome evaluation |
| Emotional state capture | Conviction tracking |
| Decision reasoning | Portfolio management |
| Pre-decision context | Signal interpretation |

### Reads

| Entity | Access | Reason |
|--------|--------|--------|
| Thesis | Read | Link decisions to beliefs |
| Conviction | Read | Capture confidence at decision time |
| User | Read | Identity |
| Portfolio | Read | Position context at decision time |

### Writes

| Entity | Fields |
|--------|--------|
| Decision | thesis_id, action, asset, quantity, reasoning, emotional_state, confidence_at_decision, timestamp |

### Emits

| Event | When | Payload |
|-------|------|---------|
| `decision_logged` | User records a decision | decision_id, thesis_id, action, emotional_state |
| `emotional_decision_flagged` | Decision appears emotionally driven | decision_id, pattern_type |
| `thesis_disconnect_detected` | Decision contradicts active thesis | decision_id, thesis_id, contradiction_type |

### Subscribes

| Event | Action |
|-------|--------|
| `conviction_changed` | Prompt: "Are you considering a move?" |
| `assumption_weakened` | Prompt: "Does this change your position?" |
| `thesis_strengthened` | Prompt: "Does this increase your conviction enough to act?" |

### Intelligence

| Capability | Purpose |
|------------|---------|
| Emotional Pattern Detection | Identify fear-driven, euphoria-driven, or reactive decision patterns |
| Reasoning Quality Analysis | Evaluate whether decision logic aligns with thesis |

### Dependencies

- Thesis Journal (link decisions to theses)
- Conviction Tracker (capture confidence at decision time)
- Unified Investor Graph

### Failure Conditions

| Scenario | Behavior |
|----------|----------|
| Decision logged without linked thesis | Block. Require thesis selection or creation. |
| User wants to retroactively log a decision | Allow. Capture original timestamp. Note it was retroactive. |
| Emotional state not provided | Prompt once. Allow skip with "not specified." |

---

## Module 5 — Investor DNA

### Purpose

Build a behavioral profile of the investor. Identify strengths, weaknesses, emotional triggers, and best-performing reasoning patterns.

### Responsibilities

| Owns | Does NOT Own |
|------|-------------|
| Behavioral profile | Individual decision logging |
| Pattern detection | Conviction tracking |
| Cognitive bias identification | Portfolio management |
| Strength/weakness mapping | Signal interpretation |

### Reads

| Entity | Access | Reason |
|--------|--------|--------|
| Decision | Read | Analyze decision patterns |
| Outcome | Read | Correlate behavior with results |
| Conviction | Read | Analyze confidence patterns |
| Thesis | Read | Analyze reasoning quality |
| User | Read | Identity |

### Writes

| Entity | Fields |
|--------|--------|
| Behavioral Profile | user_id, strengths, weaknesses, triggers, patterns, best_sectors, worst_habits |
| Pattern | type, frequency, associated_outcomes, confidence |

### Emits

| Event | When | Payload |
|-------|------|---------|
| `pattern_detected` | New behavioral pattern identified | pattern_id, type, description, frequency |
| `bias_identified` | Cognitive bias detected | bias_type, examples, severity |
| `strength_confirmed` | Positive pattern validated by outcomes | pattern_id, outcome_correlation |

### Subscribes

| Event | Action |
|-------|--------|
| `decision_logged` | Analyze for patterns |
| `outcome_recorded` | Correlate behavior with results |
| `conviction_changed` | Analyze confidence volatility |

### Intelligence

| Capability | Purpose |
|------------|---------|
| Behavioral Analysis | Detect recurring patterns across decisions |
| Cognitive Bias Detection | Identify common biases (recency, anchoring, loss aversion, etc.) |
| Performance Attribution | Correlate behavioral patterns with outcomes |

### Dependencies

- Decision Journal (requires decision history)
- Thesis Journal (requires thesis reasoning)
- Unified Investor Graph

### Failure Conditions

| Scenario | Behavior |
|----------|----------|
| Insufficient data for pattern detection | Do not guess. Wait. Show "Building your profile..." |
| Pattern detected with low confidence | Flag as "possible tendency" not "confirmed pattern" |
| User disputes a detected pattern | Allow dismissal. Track if pattern recurs. |

---

## Module 6 — Cognitive Risk Alerts

### Purpose

Warn users about their own behavioral patterns and cognitive blind spots. The system that watches the investor.

### Responsibilities

| Owns | Does NOT Own |
|------|-------------|
| Cognitive risk detection | Market risk analysis |
| Behavioral alert generation | Portfolio risk calculation |
| Self-awareness prompts | Decision logging |

### Reads

| Entity | Access | Reason |
|--------|--------|--------|
| Behavioral Profile | Read | Know user's patterns |
| Decision | Read | Detect risky behavior in real-time |
| Conviction | Read | Detect overconfidence or panic |
| Pattern | Read | Match current behavior to known patterns |
| Outcome | Read | Historical validation of risks |

### Writes

| Entity | Fields |
|--------|--------|
| Cognitive Risk Alert | user_id, type, description, severity, evidence, dismissed |

### Emits

| Event | When | Payload |
|-------|------|---------|
| `cognitive_risk_detected` | Risky behavioral pattern active | alert_id, risk_type, evidence, severity |
| `overconfidence_warning` | Conviction too high relative to evidence | thesis_id, conviction_value, evidence_strength |
| `panic_pattern_detected` | Rapid conviction drops across multiple theses | affected_theses, velocity |

### Subscribes

| Event | Action |
|-------|--------|
| `decision_logged` | Evaluate for cognitive risks |
| `conviction_changed` | Check for emotional volatility |
| `pattern_detected` | Evaluate if pattern is dangerous |
| `conviction_spike_detected` | Check for overconfidence |

### Intelligence

| Capability | Purpose |
|------------|---------|
| Behavioral Analysis | Real-time evaluation of current behavior against historical patterns |
| Risk Scoring | Assess severity of cognitive risks |

### Dependencies

- Investor DNA (requires behavioral profile)
- Decision Journal (requires decision stream)
- Conviction Tracker (requires conviction data)
- Unified Investor Graph

### Failure Conditions

| Scenario | Behavior |
|----------|----------|
| Alert fatigue risk | Max 3 cognitive alerts per day. Prioritize highest severity. |
| User dismisses all alerts | Track dismissal rate. If >80%, adjust sensitivity. |
| Insufficient behavioral data | Do not alert. Build profile silently first. |

---

## Module 7 — Portfolio X-Ray

### Purpose

Reveal hidden exposures, concentration risks, and thesis-portfolio misalignment. Show what the user cannot see about their own positions.

### Responsibilities

| Owns | Does NOT Own |
|------|-------------|
| Portfolio analysis | Trade execution |
| Concentration risk calculation | Thesis management |
| Thesis-portfolio mapping | Conviction tracking |
| Exposure visualization | Signal interpretation |

### Reads

| Entity | Access | Reason |
|--------|--------|--------|
| Portfolio | Read | Holdings data |
| Thesis | Read | Map positions to beliefs |
| Assumption | Read | Identify thesis-dependent risks |
| Narrative | Read | Detect narrative concentration |
| User | Read | Identity |

### Writes

| Entity | Fields |
|--------|--------|
| Portfolio Analysis | concentration_risk, narrative_overlap, uncovered_holdings, thesis_coverage |
| Risk | thesis_id, description, category, severity, probability |

### Emits

| Event | When | Payload |
|-------|------|---------|
| `concentration_risk_detected` | Too much exposure to one area | risk_type, affected_positions, severity |
| `thesis_gap_found` | Position with no supporting thesis | position, asset |
| `narrative_overlap_detected` | Multiple positions driven by same narrative | narrative_id, affected_positions |
| `portfolio_analysis_complete` | Analysis finished | summary, risk_count, coverage_pct |

### Subscribes

| Event | Action |
|-------|--------|
| `portfolio_changed` | Re-run analysis |
| `thesis_retired` | Check for now-uncovered positions |
| `narrative_shifted` | Re-evaluate narrative exposure |
| `assumption_weakened` | Flag affected positions |

### Intelligence

| Capability | Purpose |
|------------|---------|
| Risk Mapping | Identify threats to portfolio from assumption failures |
| Correlation Analysis | Detect hidden correlations between positions |
| Narrative Clustering | Group positions by driving narrative |

### Dependencies

- Thesis Journal (map positions to theses)
- Portfolio data source (brokerage integration or manual entry)
- Unified Investor Graph

### Failure Conditions

| Scenario | Behavior |
|----------|----------|
| Portfolio data unavailable | Allow manual entry. Prompt for data source. |
| Position has no thesis | Flag as "uncovered." Do not assume — ask user. |
| Analysis would expose >50 positions | Batch analysis. Show summary first, allow drill-down. |

---

## Module 8 — Narrative Radar

### Purpose

Track changing market narratives and map them to user theses. Detect narrative acceleration, weakening, and crowded positioning.

### Responsibilities

| Owns | Does NOT Own |
|------|-------------|
| Narrative detection | Individual thesis management |
| Narrative momentum tracking | Conviction tracking |
| Narrative-thesis mapping | Portfolio analysis |
| Crowding assessment | Signal extraction |

### Reads

| Entity | Access | Reason |
|--------|--------|--------|
| Thesis | Read | Map narratives to user beliefs |
| Signal | Read | Detect narrative-level patterns |
| Event | Read | Identify narrative-driving events |
| Portfolio | Read | Assess narrative exposure |

### Writes

| Entity | Fields |
|--------|--------|
| Narrative | title, description, momentum, crowdedness, related_theses |

### Emits

| Event | When | Payload |
|-------|------|---------|
| `narrative_detected` | New market narrative identified | narrative_id, title, description |
| `narrative_accelerating` | Narrative gaining momentum | narrative_id, evidence |
| `narrative_weakening` | Narrative losing steam | narrative_id, evidence |
| `narrative_crowded` | Narrative becoming consensus | narrative_id, crowdedness_level |
| `narrative_shifted` | Significant narrative change | narrative_id, old_momentum, new_momentum |

### Subscribes

| Event | Action |
|-------|--------|
| `signal_detected` | Analyze for narrative-level patterns |
| `event_captured` | Check for narrative implications |
| `thesis_created` | Map to existing narratives |

### Intelligence

| Capability | Purpose |
|------------|---------|
| Narrative Detection | Identify emerging market stories from event/signal patterns |
| Momentum Analysis | Track narrative strength over time |
| Crowding Assessment | Detect when narratives become consensus |

### Dependencies

- Signal Watchtower (requires signal and event data)
- Thesis Journal (map narratives to theses)
- Unified Investor Graph

### Failure Conditions

| Scenario | Behavior |
|----------|----------|
| Narrative ambiguous | Present as "emerging theme" with lower confidence |
| Too many narratives detected | Prioritize by user relevance (thesis overlap) |
| Narrative conflicts with user thesis | Surface as observation, not recommendation |

---

## Module 9 — Assumption Stress Tester

### Purpose

Simulate "what breaks this thesis?" scenarios. Let users stress-test their beliefs against hypothetical market conditions.

### Responsibilities

| Owns | Does NOT Own |
|------|-------------|
| Scenario modeling | Thesis management |
| Stress test execution | Portfolio rebalancing |
| Impact calculation | Signal interpretation |
| Scenario library | Conviction management |

### Reads

| Entity | Access | Reason |
|--------|--------|--------|
| Thesis | Read | What to stress-test |
| Assumption | Read | What to challenge |
| Portfolio | Read | Calculate position impact |
| Risk | Read | Existing risk factors |

### Writes

| Entity | Fields |
|--------|--------|
| Scenario | name, description, conditions, affected_assumptions |
| Stress Test Result | scenario_id, thesis_id, assumptions_affected, estimated_impact, severity |

### Emits

| Event | When | Payload |
|-------|------|---------|
| `stress_test_completed` | Test finished | scenario_id, thesis_id, results_summary |
| `critical_vulnerability_found` | Scenario breaks thesis | thesis_id, assumption_id, scenario_conditions |
| `resilience_confirmed` | Thesis survives scenario | thesis_id, scenario_id |

### Subscribes

| Event | Action |
|-------|--------|
| `assumption_weakened` | Suggest stress test for affected thesis |
| `macro_risk_detected` | Auto-generate relevant scenario |

### Intelligence

| Capability | Purpose |
|------------|---------|
| Risk Mapping | Calculate cascading effects of assumption failures |
| Scenario Generation | Suggest relevant stress tests based on current risks |

### Dependencies

- Thesis Journal (requires theses and assumptions)
- Portfolio X-Ray (position impact calculation)
- Unified Investor Graph

### Failure Conditions

| Scenario | Behavior |
|----------|----------|
| Thesis has no measurable assumptions | Prompt user to add measurable assumptions first |
| Scenario too broad to model | Suggest narrowing scope. Offer template scenarios. |
| User runs too many scenarios (>20) | Show summary view. Group by thesis. |

---

## Module 10 — Earnings Interpreter

### Purpose

Convert earnings calls and financial reports into thesis-relevant meaning. Translate "Revenue up 14%" into "Your margin expansion assumption strengthened."

### Responsibilities

| Owns | Does NOT Own |
|------|-------------|
| Earnings data interpretation | Thesis management |
| Assumption impact scoring | Conviction updates |
| Earnings-to-thesis mapping | Portfolio analysis |

### Reads

| Entity | Access | Reason |
|--------|--------|--------|
| Thesis | Read | What the user believes |
| Assumption | Read | What to validate |
| Portfolio | Read | Prioritize by position |
| Event | Read | Earnings events |

### Writes

| Entity | Fields |
|--------|--------|
| Signal | assumption_id, source, content, direction, strength |

### Emits

| Event | When | Payload |
|-------|------|---------|
| `earnings_interpreted` | Earnings analysis complete | company, quarter, thesis_impacts[] |
| `assumption_validated` | Earnings support assumption | assumption_id, evidence |
| `assumption_weakened` | Earnings contradict assumption | assumption_id, evidence |

### Subscribes

| Event | Action |
|-------|--------|
| `event_captured` | Check if earnings-related, interpret if so |

### Intelligence

| Capability | Purpose |
|------------|---------|
| Event Extraction | Parse earnings reports and calls |
| Assumption Mapping | Link earnings data to specific user assumptions |
| Contextual Interpretation | Translate financial data into thesis-relevant meaning |

### Dependencies

- Thesis Journal (requires theses and assumptions)
- Earnings data source
- Unified Investor Graph

### Failure Conditions

| Scenario | Behavior |
|----------|----------|
| Earnings data incomplete | Interpret what's available. Flag gaps. |
| No user theses for this company | Store interpretation. Surface as general intelligence. |
| Ambiguous earnings signal | Present both interpretations. Let user decide. |

---

## Cross-Module Event Flow

This is how modules communicate through events:

```
Thesis Journal
  ├── thesis_created ──────────► Signal Watchtower, Portfolio X-Ray
  ├── assumption_added ────────► Signal Watchtower
  └── assumption_status_changed ► Conviction Tracker, Cognitive Risk Alerts

Signal Watchtower
  ├── signal_detected ─────────► Thesis Journal, Conviction Tracker
  ├── assumption_weakened ─────► Decision Journal, Portfolio X-Ray
  └── macro_risk_detected ─────► Assumption Stress Tester

Conviction Tracker
  ├── conviction_changed ──────► Cognitive Risk Alerts
  ├── conviction_dropped ──────► Decision Journal
  └── conviction_spike_detected ► Cognitive Risk Alerts

Decision Journal
  ├── decision_logged ─────────► Investor DNA, Cognitive Risk Alerts
  └── emotional_decision_flagged► Investor DNA

Investor DNA
  ├── pattern_detected ────────► Cognitive Risk Alerts
  └── bias_identified ─────────► Cognitive Risk Alerts

Cognitive Risk Alerts
  └── cognitive_risk_detected ─► User notification

Portfolio X-Ray
  ├── concentration_risk_detected► User notification
  └── thesis_gap_found ────────► Thesis Journal

Narrative Radar
  ├── narrative_shifted ───────► Portfolio X-Ray, Thesis Journal
  └── narrative_crowded ───────► Cognitive Risk Alerts

Assumption Stress Tester
  └── critical_vulnerability_found► Cognitive Risk Alerts

Earnings Interpreter
  ├── assumption_validated ────► Conviction Tracker
  └── assumption_weakened ─────► Conviction Tracker, Decision Journal
```

---

## Data Ownership Summary

| Entity | Owner | Readers |
|--------|-------|---------|
| Thesis | Thesis Journal | All modules |
| Assumption | Thesis Journal | Signal Watchtower, Earnings Interpreter, Stress Tester, Portfolio X-Ray |
| Signal | Signal Watchtower | Thesis Journal, Conviction Tracker, Narrative Radar, Earnings Interpreter |
| Event | Signal Watchtower | Earnings Interpreter, Narrative Radar |
| Conviction | Conviction Tracker | Decision Journal, Cognitive Risk Alerts, Investor DNA |
| Decision | Decision Journal | Investor DNA, Cognitive Risk Alerts |
| Outcome | Decision Journal | Investor DNA, Thesis Journal |
| Narrative | Narrative Radar | Portfolio X-Ray, Thesis Journal |
| Risk | Portfolio X-Ray | Assumption Stress Tester, Cognitive Risk Alerts |
| Behavioral Profile | Investor DNA | Cognitive Risk Alerts |

---

*Each module is a world. The contracts are the bridges. Build the bridges first, then the worlds.*
