import type {
  Thesis,
  Conviction,
  Signal,
  MarketEvent,
  Position,
  BehaviorPattern,
  CognitiveBias,
  GovernanceRule,
  RationalityScore,
  BehavioralLesson,
} from "@/types";

export const mockTheses: Thesis[] = [
  {
    id: "1",
    title: "NVDA AI Infrastructure Dominance",
    ticker: "NVDA",
    sector: "Semiconductors/AI Infrastructure",
    description:
      "NVIDIA will maintain GPU market leadership through 2027 as AI training demand outpaces competitor supply. CUDA ecosystem creates durable switching costs.",
    confidence: 82,
    status: "conviction",
    tags: ["ai", "semiconductors", "infrastructure", "mega-cap"],
    allocation: 8.5,
    pnl: 50.8,
    createdAt: "2026-03-15",
    updatedAt: "2026-05-18",
    assumptions: [
      { id: "a1", text: "AI training compute demand grows >40% YoY through 2027", status: "validated", impact: "high", category: "demand" },
      { id: "a2", text: "CUDA ecosystem switching costs exceed $10B for hyperscalers", status: "validated", impact: "high", category: "competitive" },
      { id: "a3", text: "AMD MI400 series does not achieve >30% market share by Q4 2026", status: "holding", impact: "medium", category: "competitive" },
      { id: "a4", text: "Custom silicon (TPU, Trainium) remains niche to single cloud providers", status: "validated", impact: "medium", category: "technical" },
    ],
    risks: [
      { id: "r1", text: "China export restrictions tighten further", severity: "high", status: "active", createdAt: "2026-03-15" },
      { id: "r2", text: "Hyperscaler capex decelerates in H2 2026", severity: "medium", status: "active", createdAt: "2026-04-01" },
      { id: "r3", text: "Valuation compression if AI narrative weakens", severity: "medium", status: "active", createdAt: "2026-04-15" },
    ],
  },
  {
    id: "2",
    title: "PLTR Government AI Contract Expansion",
    ticker: "PLTR",
    sector: "Enterprise AI/Defense Tech",
    description:
      "Palantir's AIP platform positions it as the default AI layer for US government. Contract pipeline suggests 40%+ revenue growth in federal segment.",
    confidence: 52,
    status: "active",
    tags: ["defense", "enterprise", "ai", "high-growth"],
    allocation: 4.2,
    pnl: 63.9,
    createdAt: "2026-04-01",
    updatedAt: "2026-05-15",
    assumptions: [
      { id: "a1", text: "US federal AI spending exceeds $15B in FY2027", status: "holding", impact: "high", category: "demand" },
      { id: "a2", text: "AIP wins at least 3 new $100M+ contracts in 2026", status: "holding", impact: "high", category: "demand" },
      { id: "a3", text: "Competitor offerings (Anduril, Scale AI) do not erode Palantir's moat", status: "holding", impact: "medium", category: "competitive" },
      { id: "a4", text: "Commercial segment growth does not cannibalize government focus", status: "validated", impact: "low", category: "management" },
    ],
    risks: [
      { id: "r1", text: "Valuation dislocation from growth multiple compression", severity: "high", status: "active", createdAt: "2026-04-01" },
      { id: "r2", text: "Political risk if administration changes defense priorities", severity: "medium", status: "active", createdAt: "2026-04-10" },
      { id: "r3", text: "Slower commercial adoption than projected", severity: "medium", status: "active", createdAt: "2026-05-01" },
    ],
  },
  {
    id: "3",
    title: "RKLB Space Launch Services",
    ticker: "RKLB",
    sector: "Space/Launch Services",
    description:
      "Rocket Lab is capturing the small-to-medium launch market with Electron and developing Neutron for larger payloads. Vertical integration and launch cadence create a competitive moat.",
    confidence: 80,
    status: "conviction",
    tags: ["space", "launch", "asymmetric"],
    allocation: 5.8,
    pnl: 61.1,
    createdAt: "2026-02-20",
    updatedAt: "2026-05-10",
    assumptions: [
      { id: "a1", text: "Neutron achieves first successful launch by Q3 2026", status: "holding", impact: "high", category: "technical" },
      { id: "a2", text: "Small satellite launch demand grows 25%+ YoY", status: "validated", impact: "high", category: "demand" },
    ],
    risks: [
      { id: "r1", text: "Neutron development delays or failures", severity: "high", status: "active", createdAt: "2026-02-20" },
      { id: "r2", text: "SpaceX Starship reduces per-kg launch costs dramatically", severity: "medium", status: "active", createdAt: "2026-03-01" },
    ],
  },
  {
    id: "4",
    title: "OXY Energy Carbon Capture",
    ticker: "OXY",
    sector: "Energy/Carbon Capture",
    description:
      "Occidental Petroleum's direct air capture technology positions it uniquely in the energy transition. However, oil price volatility and carbon credit uncertainty challenge the thesis.",
    confidence: 22,
    status: "abandoned",
    tags: ["energy", "carbon-capture", "value"],
    allocation: 0,
    pnl: -12.9,
    createdAt: "2025-11-05",
    updatedAt: "2026-04-20",
    assumptions: [
      { id: "a1", text: "Carbon credit prices exceed $100/ton by 2027", status: "invalidated", impact: "high", category: "macro" },
      { id: "a2", text: "Direct air capture becomes commercially viable at scale", status: "weakening", impact: "high", category: "technical" },
    ],
    risks: [
      { id: "r1", text: "Oil price collapse reduces cash flow for DAC investment", severity: "high", status: "materialized", createdAt: "2025-11-05" },
      { id: "r2", text: "Government subsidy reductions for carbon capture", severity: "medium", status: "active", createdAt: "2026-01-15" },
    ],
  },
  {
    id: "5",
    title: "CELH Consumer Beverage Growth",
    ticker: "CELH",
    sector: "Consumer/Beverages",
    description:
      "Celsius Holdings energy drink growth was expected to continue expanding distribution. Thesis invalidated due to slowing growth and increased competition.",
    confidence: 15,
    status: "abandoned",
    tags: ["consumer", "beverages", "closed"],
    allocation: 0,
    pnl: -38.2,
    createdAt: "2025-09-15",
    updatedAt: "2026-03-01",
    assumptions: [
      { id: "a1", text: "Revenue growth sustains >30% YoY through 2026", status: "invalidated", impact: "high", category: "demand" },
      { id: "a2", text: "Distribution expansion into international markets accelerates", status: "invalidated", impact: "medium", category: "demand" },
    ],
    risks: [
      { id: "r1", text: "Monster/Red Bull competitive response", severity: "high", status: "materialized", createdAt: "2025-09-15" },
      { id: "r2", text: "Consumer taste shift away from energy drinks", severity: "medium", status: "active", createdAt: "2026-01-01" },
    ],
  },
];

export const mockConvictions: Conviction[] = [
  { id: "c1", thesisId: "1", value: 65, reasoning: "Initial thesis based on AI demand trajectory", recordedAt: "2026-03-15" },
  { id: "c2", thesisId: "1", value: 72, reasoning: "Q1 earnings confirmed datacenter growth", recordedAt: "2026-04-02" },
  { id: "c3", thesisId: "1", value: 80, reasoning: "CUDA adoption data stronger than expected", recordedAt: "2026-04-20" },
  { id: "c4", thesisId: "1", value: 85, reasoning: "Competitor delays confirmed, supply constraints holding", recordedAt: "2026-05-18" },
  { id: "c5", thesisId: "2", value: 70, reasoning: "AIP platform thesis intact", recordedAt: "2026-04-01" },
  { id: "c6", thesisId: "2", value: 62, reasoning: "Contract pipeline slower than expected", recordedAt: "2026-04-20" },
  { id: "c7", thesisId: "2", value: 55, reasoning: "Valuation concerns growing", recordedAt: "2026-05-01" },
  { id: "c8", thesisId: "2", value: 52, reasoning: "No new major contracts announced", recordedAt: "2026-05-15" },
  { id: "c9", thesisId: "3", value: 70, reasoning: "Space launch market thesis", recordedAt: "2026-02-20" },
  { id: "c10", thesisId: "3", value: 75, reasoning: "Electron launch cadence increasing", recordedAt: "2026-03-15" },
  { id: "c11", thesisId: "3", value: 80, reasoning: "Neutron development on track", recordedAt: "2026-05-10" },
];

export const mockSignals: Signal[] = [
  { id: "s1", thesisId: "1", assumptionId: "a1", source: "earnings", content: "Microsoft Azure AI revenue grew 48% YoY in Q1 2026", direction: "supportive", strength: "strong", timestamp: "2026-04-25" },
  { id: "s2", thesisId: "1", assumptionId: "a2", source: "news", content: "Google announces $10B+ investment in custom TPUs for 2027", direction: "contradicting", strength: "moderate", timestamp: "2026-05-10" },
  { id: "s3", thesisId: "3", assumptionId: "a2", source: "news", content: "Small satellite constellation orders increase 35% in Q1", direction: "supportive", strength: "strong", timestamp: "2026-04-10" },
  { id: "s4", thesisId: "4", assumptionId: "a2", source: "news", content: "Canon announces EUV prototype, but 3+ years from production", direction: "supportive", strength: "moderate", timestamp: "2026-04-15" },
  { id: "s5", thesisId: "2", assumptionId: "a2", source: "news", content: "Palantir wins $480M Army contract extension", direction: "supportive", strength: "strong", timestamp: "2026-05-01" },
];

export const mockEvents: MarketEvent[] = [
  {
    id: "e1",
    title: "Microsoft Azure AI Revenue Grows 48% YoY",
    summary: "Microsoft reported Q1 2026 earnings with Azure AI revenue growing 48% year-over-year.",
    source: "Microsoft Q1 2026 Earnings",
    category: "earnings",
    sentiment: "positive",
    entities: ["Microsoft", "Azure", "AI"],
    relatedThesisIds: ["1"],
    relatedAssumptionIds: ["a1"],
    impactScore: 75,
    reasoning: "Directly validates the AI infrastructure demand thesis. Enterprise AI spending growth exceeding expectations.",
    createdAt: "2026-04-25",
  },
  {
    id: "e2",
    title: "Google Invests $10B+ in Custom TPUs",
    summary: "Google announced over $10 billion investment in custom TPU infrastructure for 2027.",
    source: "Google Cloud Next 2026",
    category: "news",
    sentiment: "mixed",
    entities: ["Google", "TPU", "NVIDIA"],
    relatedThesisIds: ["1"],
    relatedAssumptionIds: ["a2", "a4"],
    impactScore: -30,
    reasoning: "Challenges the CUDA switching cost assumption. Custom silicon could reduce hyperscaler dependency on NVIDIA.",
    createdAt: "2026-05-10",
  },
  {
    id: "e3",
    title: "Palantir Wins $480M Army Contract Extension",
    summary: "Palantir secured a $480 million contract extension with the US Army for its AI-powered intelligence platform.",
    source: "Palantir 8-K Filing",
    category: "company",
    sentiment: "positive",
    entities: ["Palantir", "US Army", "AIP"],
    relatedThesisIds: ["2"],
    relatedAssumptionIds: ["a2"],
    impactScore: 65,
    reasoning: "Validates the thesis that Palantir's AIP platform is becoming the default AI layer for US government.",
    createdAt: "2026-05-01",
  },
  {
    id: "e4",
    title: "Fed Signals Extended Higher-for-Longer Rate Stance",
    summary: "Federal Reserve officials indicated interest rates will remain elevated longer than markets expected.",
    source: "FOMC Meeting Minutes",
    category: "macro",
    sentiment: "negative",
    entities: ["Federal Reserve", "Interest Rates"],
    relatedThesisIds: ["1", "2", "3"],
    relatedAssumptionIds: [],
    impactScore: -45,
    reasoning: "Higher rates reduce the present value of future growth cash flows, pressuring valuations across growth-oriented theses.",
    createdAt: "2026-05-15",
  },
];

export const mockPositions: Position[] = [
  { id: "p1", asset: "NVIDIA Corporation", ticker: "NVDA", quantity: 50, avgCost: 420.50, currentPrice: 875.30, thesisId: "1", sector: "Semiconductors", addedAt: "2026-03-15" },
  { id: "p2", asset: "Palantir Technologies", ticker: "PLTR", quantity: 200, avgCost: 22.40, currentPrice: 28.75, thesisId: "2", sector: "Enterprise Software", addedAt: "2026-04-01" },
  { id: "p3", asset: "Rocket Lab USA", ticker: "RKLB", quantity: 150, avgCost: 8.20, currentPrice: 18.50, thesisId: "3", sector: "Aerospace", addedAt: "2026-02-20" },
];

// --- Behavior & Governance ---

export const mockBehaviorPatterns: BehaviorPattern[] = [
  {
    id: "bp1",
    type: "position-sizing",
    severity: "warning",
    title: "Position Sizing Alert",
    description: "Your NVDA position has grown to 8.5% of portfolio. Consider rebalancing if it exceeds your 10% governance rule. The concentration risk increases portfolio volatility significantly during earnings seasons.",
    time: "2 days ago",
  },
  {
    id: "bp2",
    type: "conviction-drift",
    severity: "info",
    title: "Conviction Drift Detected",
    description: "PLTR conviction has declined from 70% to 52% over 6 weeks without a corresponding position reduction. If conviction drops below 50%, consider whether this is still a thesis-driven position or a hope trade.",
    time: "1 week ago",
  },
  {
    id: "bp3",
    type: "fomo-entry",
    severity: "alert",
    title: "FOMO Entry Warning",
    description: "You entered OXY during a 15% price spike without updating your conviction score or risk assessment. Historical analysis shows FOMO entries have a 65% loss rate in your portfolio.",
    time: "3 weeks ago",
  },
  {
    id: "bp4",
    type: "panic-selling",
    severity: "warning",
    title: "Panic Selling Pattern",
    description: "CELH was sold after a -12% drawdown without updating the thesis or reviewing invalidated assumptions. The position was -38% from entry. Post-mortem analysis suggests the thesis was wrong, not the timing.",
    time: "1 month ago",
  },
];

export const mockCognitiveBiases: CognitiveBias[] = [
  { name: "Loss Aversion", level: 72 },
  { name: "Recency Bias", level: 58 },
  { name: "Anchoring", level: 45 },
  { name: "Overconfidence", level: 35 },
  { name: "Confirmation Bias", level: 62 },
  { name: "Herding", level: 28 },
];

export const mockGovernanceRules: GovernanceRule[] = [
  { id: "gr1", name: "Max 10% Position Size", description: "No single position should exceed 10% of total portfolio value.", active: true },
  { id: "gr2", name: "Mandatory Conviction Review on -15% Drawdown", description: "When a position drops 15% from its high, a full conviction review must be completed within 48 hours.", active: true },
  { id: "gr3", name: "No FOMO Entries", description: "Do not enter a position during a price spike without updating conviction score and risk assessment first.", active: true, triggeredAt: "2026-04-18" },
  { id: "gr4", name: "Max 3 Concurrent Active Theses", description: "Focus capital and attention. No more than 3 active theses at any time.", active: true },
  { id: "gr5", name: "Earnings Blackout Zone", description: "No new positions or position increases within 2 weeks of a holding's earnings report.", active: false },
];

export const mockRationalityScores: RationalityScore[] = [
  { label: "Decision Quality", value: 78 },
  { label: "Process Adherence", value: 85 },
  { label: "Emotional Stability", value: 65 },
  { label: "Risk Discipline", value: 90 },
];

export const mockBehavioralLessons: BehavioralLesson[] = [
  { id: "bl1", icon: "📉", text: "Distribution risk is real — CELH thesis was invalidated by competitive response, not market conditions. Always assess competitor reaction.", category: "loss" },
  { id: "bl2", icon: "🚀", text: "Don't chase highs — OXY was entered during a price spike. FOMO entries have a 65% loss rate in your portfolio.", category: "loss" },
  { id: "bl3", icon: "🧠", text: "Conviction should be data-driven — PLTR conviction declined from 70% to 52% without position reduction. Trust your own signals.", category: "lesson" },
  { id: "bl4", icon: "⚖️", text: "Position sizing matters — NVDA's outperformance means it now represents 8.5% of portfolio. Rebalance before concentration becomes risk.", category: "win" },
];
