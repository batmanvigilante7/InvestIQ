import type { Thesis, Conviction, Signal } from "@/types";

export const mockTheses: Thesis[] = [
  {
    id: "1",
    title: "NVDA AI Infrastructure Dominance",
    description:
      "NVIDIA will maintain GPU market leadership through 2027 as AI training demand outpaces competitor supply. CUDA ecosystem creates durable switching costs.",
    confidence: 85,
    status: "conviction",
    tags: ["semiconductor", "AI", "infrastructure"],
    createdAt: "2026-03-15",
    updatedAt: "2026-05-18",
    assumptions: [
      {
        id: "a1",
        text: "AI training compute demand grows >40% YoY through 2027",
        status: "validated",
        impact: "high",
        category: "demand",
      },
      {
        id: "a2",
        text: "CUDA ecosystem switching costs exceed $10B for hyperscalers",
        status: "validated",
        impact: "high",
        category: "competitive",
      },
      {
        id: "a3",
        text: "AMD MI400 series does not achieve >30% market share by Q4 2026",
        status: "holding",
        impact: "medium",
        category: "competitive",
      },
      {
        id: "a4",
        text: "Custom silicon (TPU, Trainium) remains niche to single cloud providers",
        status: "validated",
        impact: "medium",
        category: "technical",
      },
    ],
    risks: [
      { id: "r1", text: "China export restrictions tighten further", severity: "high", status: "active", createdAt: "2026-03-15" },
    ],
  },
  {
    id: "2",
    title: "TSLA Robotaxi Optionality",
    description:
      "Tesla's autonomous driving data moat is undervalued. FSD fleet miles create a flywheel competitors cannot replicate. Robotaxi launch will rerate the stock.",
    confidence: 52,
    status: "reviewing",
    tags: ["EV", "autonomous", "AI"],
    createdAt: "2026-02-10",
    updatedAt: "2026-05-12",
    assumptions: [
      {
        id: "a1",
        text: "FSD achieves L4 certification in at least 3 US states by end of 2026",
        status: "holding",
        impact: "high",
        category: "regulatory",
      },
      {
        id: "a2",
        text: "Tesla fleet drives >5B miles with FSD active by Q3 2026",
        status: "validated",
        impact: "high",
        category: "technical",
      },
      {
        id: "a3",
        text: "Waymo expansion slows due to mapping cost constraints",
        status: "invalidated",
        impact: "medium",
        category: "competitive",
      },
      {
        id: "a4",
        text: "Regulatory framework does not favor incumbent automakers",
        status: "holding",
        impact: "medium",
        category: "regulatory",
      },
      {
        id: "a5",
        text: "Insurance liability model for robotaxi becomes commercially viable",
        status: "holding",
        impact: "low",
        category: "macro",
      },
    ],
    risks: [
      { id: "r2", text: "Waymo partnership with Hyundai accelerates competition", severity: "high", status: "materialized", createdAt: "2026-03-20" },
    ],
  },
  {
    id: "3",
    title: "ASML Monopoly on EUV Lithography",
    description:
      "ASML is the sole supplier of EUV machines critical for advanced chip manufacturing. Supply constraints and rising demand guarantee pricing power through 2028.",
    confidence: 78,
    status: "active",
    tags: ["semiconductor", "equipment", "monopoly"],
    createdAt: "2026-01-20",
    updatedAt: "2026-05-05",
    assumptions: [
      {
        id: "a1",
        text: "No viable EUV alternative emerges from China or Japan by 2027",
        status: "validated",
        impact: "high",
        category: "competitive",
      },
      {
        id: "a2",
        text: "TSMC, Samsung, Intel all increase EUV capex in next 18 months",
        status: "validated",
        impact: "high",
        category: "demand",
      },
      {
        id: "a3",
        text: "High-NA EUV adoption follows projected timeline",
        status: "holding",
        impact: "medium",
        category: "technical",
      },
    ],
    risks: [],
  },
  {
    id: "4",
    title: "PLTR Government AI Contract Expansion",
    description:
      "Palantir's AIP platform positions it as the default AI layer for US government. Contract pipeline suggests 40%+ revenue growth in federal segment.",
    confidence: 64,
    status: "active",
    tags: ["government", "AI", "SaaS"],
    createdAt: "2026-04-01",
    updatedAt: "2026-05-15",
    assumptions: [
      {
        id: "a1",
        text: "US federal AI spending exceeds $15B in FY2027",
        status: "holding",
        impact: "high",
        category: "demand",
      },
      {
        id: "a2",
        text: "AIP wins at least 3 new $100M+ contracts in 2026",
        status: "holding",
        impact: "high",
        category: "demand",
      },
      {
        id: "a3",
        text: "Competitor offerings (Anduril, Scale AI) do not erode Palantir's moat",
        status: "holding",
        impact: "medium",
        category: "competitive",
      },
      {
        id: "a4",
        text: "Commercial segment growth does not cannibalize government focus",
        status: "validated",
        impact: "low",
        category: "management",
      },
    ],
    risks: [],
  },
  {
    id: "5",
    title: "COIN Crypto Cycle Play",
    description:
      "Coinbase benefits from regulatory clarity and ETF inflows. Position as regulated on-ramp creates durable advantage as institutional adoption accelerates.",
    confidence: 38,
    status: "abandoned",
    tags: ["crypto", "fintech", "regulation"],
    createdAt: "2025-11-05",
    updatedAt: "2026-04-20",
    assumptions: [
      {
        id: "a1",
        text: "Bitcoin ETF AUM exceeds $150B by Q2 2026",
        status: "invalidated",
        impact: "high",
        category: "demand",
      },
      {
        id: "a2",
        text: "SEC does not impose restrictive DeFi regulations",
        status: "validated",
        impact: "medium",
        category: "regulatory",
      },
      {
        id: "a3",
        text: "Coinbase L2 (Base) captures >20% of L2 TVL",
        status: "invalidated",
        impact: "medium",
        category: "technical",
      },
    ],
    risks: [],
  },
];

export const mockConvictions: Conviction[] = [
  // NVDA conviction history
  { id: "c1", thesisId: "1", value: 65, reasoning: "Initial thesis based on AI demand trajectory", recordedAt: "2026-03-15" },
  { id: "c2", thesisId: "1", value: 72, reasoning: "Q1 earnings confirmed datacenter growth", recordedAt: "2026-04-02" },
  { id: "c3", thesisId: "1", value: 80, reasoning: "CUDA adoption data stronger than expected", recordedAt: "2026-04-20" },
  { id: "c4", thesisId: "1", value: 85, reasoning: "Competitor delays confirmed, supply constraints holding", recordedAt: "2026-05-18" },
  // TSLA conviction history
  { id: "c5", thesisId: "2", value: 70, reasoning: "FSD data moat thesis intact", recordedAt: "2026-02-10" },
  { id: "c6", thesisId: "2", value: 62, reasoning: "Waymo expansion faster than expected, assumption challenged", recordedAt: "2026-03-15" },
  { id: "c7", thesisId: "2", value: 55, reasoning: "Regulatory uncertainty increasing", recordedAt: "2026-04-10" },
  { id: "c8", thesisId: "2", value: 52, reasoning: "No L4 certification progress yet", recordedAt: "2026-05-12" },
  // ASML conviction history
  { id: "c9", thesisId: "3", value: 70, reasoning: "EUV monopoly thesis", recordedAt: "2026-01-20" },
  { id: "c10", thesisId: "3", value: 75, reasoning: "Capex guidance from TSMC confirmed", recordedAt: "2026-03-01" },
  { id: "c11", thesisId: "3", value: 78, reasoning: "No competitor alternatives emerging", recordedAt: "2026-05-05" },
];

export const mockSignals: Signal[] = [
  { id: "s1", thesisId: "1", assumptionId: "a1", source: "earnings", content: "Microsoft Azure AI revenue grew 48% YoY in Q1 2026", direction: "supportive", strength: "strong", timestamp: "2026-04-25" },
  { id: "s2", thesisId: "1", assumptionId: "a2", source: "news", content: "Google announces $10B+ investment in custom TPUs for 2027", direction: "contradicting", strength: "moderate", timestamp: "2026-05-10" },
  { id: "s3", thesisId: "2", assumptionId: "a3", source: "news", content: "Waymo expands to 5 new cities, partnership with Hyundai confirmed", direction: "contradicting", strength: "strong", timestamp: "2026-03-20" },
  { id: "s4", thesisId: "3", assumptionId: "a1", source: "news", content: "Canon announces EUV prototype, but 3+ years from production", direction: "supportive", strength: "moderate", timestamp: "2026-04-15" },
  { id: "s5", thesisId: "4", assumptionId: "a2", source: "news", content: "Palantir wins $480M Army contract extension", direction: "supportive", strength: "strong", timestamp: "2026-05-01" },
];
