"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  FolioState,
  Thesis,
  Assumption,
  Conviction,
  Signal,
  MarketEvent,
  Decision,
  Outcome,
  Risk,
  Narrative,
  Position,
  CognitiveAlert,
} from "@/types";
import { mockTheses, mockConvictions, mockSignals, mockEvents } from "./mockData";

export const useStore = create<FolioState>()(
  persist(
    (set, get) => ({
      // Data
      theses: mockTheses as Thesis[],
      signals: mockSignals as Signal[],
      convictions: mockConvictions as Conviction[],
      events: mockEvents as MarketEvent[],
      decisions: [] as Decision[],
      outcomes: [] as Outcome[],
      risks: [] as Risk[],
      narratives: [] as Narrative[],
      positions: [] as Position[],
      cognitiveAlerts: [] as CognitiveAlert[],

      // ─── Thesis CRUD ───
      addThesis: (thesis) =>
        set((state) => ({
          theses: [
            ...state.theses,
            {
              ...thesis,
              id: `t-${Date.now()}`,
              createdAt: new Date().toISOString().split("T")[0],
              updatedAt: new Date().toISOString().split("T")[0],
            },
          ],
        })),

      updateThesis: (id, updates) =>
        set((state) => ({
          theses: state.theses.map((t) =>
            t.id === id
              ? { ...t, ...updates, updatedAt: new Date().toISOString().split("T")[0] }
              : t
          ),
        })),

      deleteThesis: (id) =>
        set((state) => ({
          theses: state.theses.filter((t) => t.id !== id),
          convictions: state.convictions.filter((c) => c.thesisId !== id),
          signals: state.signals.filter((s) => s.thesisId !== id),
          decisions: state.decisions.filter((d) => d.thesisId !== id),
        })),

      // ─── Assumption CRUD ───
      addAssumption: (thesisId, assumption) =>
        set((state) => ({
          theses: state.theses.map((t) =>
            t.id === thesisId
              ? {
                  ...t,
                  assumptions: [...t.assumptions, assumption],
                  updatedAt: new Date().toISOString().split("T")[0],
                }
              : t
          ),
        })),

      updateAssumption: (thesisId, assumptionId, updates) =>
        set((state) => ({
          theses: state.theses.map((t) =>
            t.id === thesisId
              ? {
                  ...t,
                  assumptions: t.assumptions.map((a) =>
                    a.id === assumptionId ? { ...a, ...updates } : a
                  ),
                  updatedAt: new Date().toISOString().split("T")[0],
                }
              : t
          ),
        })),

      deleteAssumption: (thesisId, assumptionId) =>
        set((state) => ({
          theses: state.theses.map((t) =>
            t.id === thesisId
              ? {
                  ...t,
                  assumptions: t.assumptions.filter((a) => a.id !== assumptionId),
                  updatedAt: new Date().toISOString().split("T")[0],
                }
              : t
          ),
        })),

      // ─── Conviction ───
      addConviction: (conviction) =>
        set((state) => {
          const thesisConvictions = state.convictions.filter((c) => c.thesisId === conviction.thesisId);
          const previousValue = thesisConvictions.length > 0
            ? thesisConvictions[thesisConvictions.length - 1].value
            : undefined;
          const delta = previousValue !== undefined ? conviction.value - previousValue : undefined;

          const newConviction: Conviction = {
            ...conviction,
            id: `c-${Date.now()}`,
            previousValue,
            delta,
            recordedAt: new Date().toISOString().split("T")[0],
          };
          const updatedTheses = state.theses.map((t) =>
            t.id === conviction.thesisId
              ? { ...t, confidence: conviction.value, updatedAt: new Date().toISOString().split("T")[0] }
              : t
          );
          return {
            convictions: [...state.convictions, newConviction],
            theses: updatedTheses,
          };
        }),

      getConvictionStability: (thesisId) => {
        const thesisConvictions = get().convictions.filter((c) => c.thesisId === thesisId);
        if (thesisConvictions.length < 3) return "stable";
        const recent = thesisConvictions.slice(-5);
        const deltas = recent.map((c) => Math.abs(c.delta ?? 0));
        const avgDelta = deltas.reduce((sum, d) => sum + d, 0) / deltas.length;
        const latestTrend = recent[recent.length - 1].delta ?? 0;
        if (avgDelta > 10) return "volatile";
        if (latestTrend < -5) return "declining";
        if (latestTrend > 5) return "rising";
        return "stable";
      },

      // ─── Signals ───
      addSignal: (signal) =>
        set((state) => ({
          signals: [
            ...state.signals,
            {
              ...signal,
              id: `s-${Date.now()}`,
              timestamp: new Date().toISOString().split("T")[0],
            },
          ],
        })),

      // ─── Events ───
      addEvent: (event) =>
        set((state) => ({
          events: [
            ...state.events,
            {
              ...event,
              id: `e-${Date.now()}`,
              createdAt: new Date().toISOString().split("T")[0],
            },
          ],
        })),

      linkEventToThesis: (eventId, thesisId, assumptionIds = []) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === eventId
              ? {
                  ...e,
                  relatedThesisIds: [...new Set([...e.relatedThesisIds, thesisId])],
                  relatedAssumptionIds: [...new Set([...e.relatedAssumptionIds, ...assumptionIds])],
                }
              : e
          ),
        })),

      // ─── Decisions ───
      addDecision: (decision) =>
        set((state) => ({
          decisions: [...state.decisions, decision],
        })),

      // ─── Outcomes ───
      addOutcome: (outcome) =>
        set((state) => ({
          outcomes: [...state.outcomes, outcome],
        })),

      // ─── Risks ───
      addRisk: (risk) =>
        set((state) => ({
          risks: [...state.risks, risk],
        })),

      updateRisk: (id, updates) =>
        set((state) => ({
          risks: state.risks.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        })),

      // ─── Positions ───
      addPosition: (position) =>
        set((state) => ({
          positions: [...state.positions, position],
        })),

      updatePosition: (id, updates) =>
        set((state) => ({
          positions: state.positions.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      deletePosition: (id) =>
        set((state) => ({
          positions: state.positions.filter((p) => p.id !== id),
        })),

      // ─── Alerts ───
      dismissAlert: (id) =>
        set((state) => ({
          cognitiveAlerts: state.cognitiveAlerts.map((a) =>
            a.id === id ? { ...a, dismissed: true } : a
          ),
        })),
    }),
    {
      name: "folioai-storage",
    }
  )
);
