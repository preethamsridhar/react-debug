import { usePipeline } from '../context/PipelineContext';
import { getDealAge, formatCurrency } from '../utils/pipeline';

const PRIORITY_COLOR = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' };

export default function DealCard({ deal }) {
  const { selectedDeal, setSelectedDeal } = usePipeline();
  const isSelected = selectedDeal?.id === deal.id;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const ageMs = new Date() - new Date(deal.createdAt);
  const ageDays = ageMs;

  const handleSelect = () => {
    setSelectedDeal(deal);
  };

  return (
    <div
      className={`deal-card ${isSelected ? 'deal-card--selected' : ''}`}
      onClick={handleSelect}
    >
      <div className="deal-card__header">
        <span className="deal-card__company">{deal.company}</span>
        <span
          className="deal-card__priority"
          style={{ color: PRIORITY_COLOR[deal.priority] }}
        >
          ● {deal.priority}
        </span>
      </div>
      <div className="deal-card__title">{deal.title}</div>
      <div className="deal-card__meta">
        <span className="deal-card__value">{formatCurrency(deal.value)}</span>
        <span className="deal-card__age">{ageDays}d old</span>
      </div>
      <div className="deal-card__date">Created {formatDate(deal.createdAt)}</div>
    </div>
  );
}
