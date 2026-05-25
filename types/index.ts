// ============================================
// FolioAI Domain Model
// Progressive Intelligence Architecture
// ============================================

// --- Core Enums ---

export type ThesisStatus =
  | "active"
  | "reviewing"
  | "conviction"
  | "abandoned";

export type AssumptionStatus =
  | "validated"
  | "holding"
  | "invalidated"
  | "weakening";

export type AssumptionImpact = "high" | "medium" | "low";

export type AssumptionCategory =
  | "demand"
  | "supply"
  | "macro"
  | "regulatory"
  | "competitive"
  | "technical"
  | "management";

// --- Core Entities ---

export interface Assumption {
  id: string;
  text: string;
  status: AssumptionStatus;
  impact: AssumptionImpact;
  category: AssumptionCategory;
  notes?: string;
}

export interface Risk {
  id: string;
  text: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "active" | "materialized" | "mitigated";
  createdAt: string;
}

export interface Thesis {
  id: string;
  title: string;
  description: string;
  confidence: number;
  assumptions: Assumption[];
  risks: Risk[];
  tags: string[];
  status: ThesisStatus;
  createdAt: string;
  updatedAt: string;
}

// --- Stage 2: Signal Layer ---

export type SignalDirection = "supportive" | "contradicting" | "neutral";
export type SignalSource = "news" | "earnings" | "data_feed" | "user_input" | "analyst";

export interface Signal {
  id: string;
  assumptionId?: string;
  thesisId: string;
  source: SignalSource;
  content: string;
  direction: SignalDirection;
  strength: "weak" | "moderate" | "strong";
  timestamp: string;
}

// --- Stage 3: Conviction Layer ---

export interface Conviction {
  id: string;
  thesisId: string;
  value: number;
  reasoning?: string;
  recordedAt: string;
}

// --- Stage 4: Decision Layer ---

export type DecisionAction = "buy" | "sell" | "hold" | "rebalance" | "exit" | "add";
export type EmotionalState = "calm" | "anxious" | "euphoric" | "fearful" | "neutral" | "confused";

export interface Decision {
  id: string;
  thesisId: string;
  action: DecisionAction;
  asset?: string;
  quantity?: number;
  reasoning: string;
  emotionalState: EmotionalState;
  confidenceAtDecision: number;
  timestamp: string;
}

// --- Stage 5: Outcome Layer ---

export interface Outcome {
  id: string;
  decisionId: string;
  thesisId: string;
  returnPct?: number;
  evaluatedAt: string;
  thesisWasCorrect?: boolean;
  whatWasMissed?: string;
}

// --- Stage 6: Narrative Layer ---

export type NarrativeMomentum = "accelerating" | "stable" | "weakening" | "exhausted";
export type NarrativeCrowdedness = "early" | "growing" | "crowded" | "consensus";

export interface Narrative {
  id: string;
  title: string;
  description: string;
  momentum: NarrativeMomentum;
  crowdedness: NarrativeCrowdedness;
  relatedThesisIds: string[];
  createdAt: string;
  lastUpdatedAt: string;
}

// --- Stage 4: Portfolio Layer ---

export interface Position {
  id: string;
  asset: string;
  ticker: string;
  quantity: number;
  avgCost: number;
  currentPrice?: number;
  thesisId?: string;
  sector?: string;
  addedAt: string;
}

// --- Cognitive Alerts ---

export interface CognitiveAlert {
  id: string;
  type: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  evidence: string[];
  dismissed: boolean;
  createdAt: string;
}

// --- Store Shape ---

export interface FolioState {
  // Data
  theses: Thesis[];
  convictions: Conviction[];
  signals: Signal[];
  decisions: Decision[];
  outcomes: Outcome[];
  risks: Risk[];
  narratives: Narrative[];
  positions: Position[];
  cognitiveAlerts: CognitiveAlert[];

  // Thesis actions
  addThesis: (thesis: Omit<Thesis, "id" | "createdAt" | "updatedAt">) => void;
  updateThesis: (id: string, updates: Partial<Thesis>) => void;
  deleteThesis: (id: string) => void;

  // Assumption actions
  addAssumption: (thesisId: string, assumption: Assumption) => void;
  updateAssumption: (thesisId: string, assumptionId: string, updates: Partial<Assumption>) => void;
  deleteAssumption: (thesisId: string, assumptionId: string) => void;

  // Conviction actions
  addConviction: (conviction: Omit<Conviction, "id" | "recordedAt">) => void;

  // Signal actions
  addSignal: (signal: Omit<Signal, "id" | "timestamp">) => void;

  // Decision actions
  addDecision: (decision: Decision) => void;

  // Outcome actions
  addOutcome: (outcome: Outcome) => void;

  // Risk actions
  addRisk: (risk: Risk) => void;
  updateRisk: (id: string, updates: Partial<Risk>) => void;

  // Position actions
  addPosition: (position: Position) => void;
  updatePosition: (id: string, updates: Partial<Position>) => void;
  deletePosition: (id: string) => void;

  // Alert actions
  dismissAlert: (id: string) => void;
}
