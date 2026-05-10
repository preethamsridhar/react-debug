import { useState, useEffect } from 'react';
import { usePipeline } from '../context/PipelineContext';
import { STAGES } from '../data/mockData';
import DealCard from './DealCard';
import { groupDealsByStage, filterByStage } from '../utils/pipeline';

export default function PipelineBoard() {
  const { deals, setDeals, stageFilter } = usePipeline();
  const [search, setSearch]             = useState('');
  const [stageTotals, setStageTotals]   = useState({});

  useEffect(() => {
    const totals = {};
    STAGES.forEach((s) => {
      totals[s] = deals.filter((d) => d.stage === s).reduce((sum, d) => sum + d.value, 0);
    });
    setStageTotals(totals);
  }, []);

  const visibleDeals = filterByStage(deals, stageFilter).filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.company.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = groupDealsByStage(visibleDeals);

  const handleDragStart = (e, dealId) => {
    e.dataTransfer.setData('dealId', dealId);
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    const idx = deals.findIndex((d) => d.id === dealId);
    if (idx === -1) return;
    deals[idx] = { ...deals[idx], stage: targetStage };
    setDeals([...deals]);
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="board-wrapper">
      <div className="board-toolbar">
        <input
          className="search-input"
          placeholder="Search deals…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="stage-totals">
          {STAGES.slice(0, 4).map((s) => (
            <span key={s} className="stage-total-chip">
              {s.split(' ')[0]}: {stageTotals[s] != null ? `$${(stageTotals[s] / 1000).toFixed(0)}k` : '—'}
            </span>
          ))}
        </div>
      </div>

      <div className="kanban-board">
        {STAGES.map((stage) => (
          <div
            key={stage}
            className="kanban-column"
            onDrop={(e) => handleDrop(e, stage)}
            onDragOver={handleDragOver}
          >
            <div className="kanban-column__header">
              <span className="kanban-column__name">{stage}</span>
              <span className="kanban-column__count">
                {(grouped[stage] ?? []).length}
              </span>
            </div>
            <div className="kanban-column__cards">
              {(grouped[stage] ?? []).map((deal) => (
                <div
                  key={deal.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, deal.id)}
                >
                  <DealCard deal={deal} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
