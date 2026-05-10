import { createContext, useContext, useState } from 'react';
import { DEALS, REPS, ACTIVITIES } from '../data/mockData';

export const PipelineContext = createContext(null);

export function PipelineProvider({ children }) {
  const [deals, setDeals]               = useState(DEALS);
  const [reps]                          = useState(REPS);
  const [activities, setActivities]     = useState(ACTIVITIES);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [stageFilter, setStageFilter]   = useState('All');

  const value = {
    deals,
    setDeals,
    reps,
    activities,
    setActivities,
    selectedDeal,
    stageFilter,
    setStageFilter,
  };

  return (
    <PipelineContext.Provider value={value}>
      {children}
    </PipelineContext.Provider>
  );
}

export function usePipeline() {
  const ctx = useContext(PipelineContext);
  if (!ctx) throw new Error('usePipeline must be used inside PipelineProvider');
  return ctx;
}
