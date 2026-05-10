import { useState } from 'react';
import { usePipeline } from '../context/PipelineContext';
import { STAGES, REPS } from '../data/mockData';

const EMPTY_DEAL = {
  title: '',
  company: '',
  value: '',
  stage: 'Prospecting',
  repId: 'r1',
  priority: 'medium',
};

export default function DealForm({ initialDeal, onClose }) {
  const { setDeals, deals } = usePipeline();
  const [form, setForm] = useState(initialDeal ?? EMPTY_DEAL);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleValueChange = (e) => {
    const raw = parseInt(e.target.value);
    handleChange('value', raw);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      const newDeal = {
        ...form,
        id: `d${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        closedAt: null,
      };
      setDeals([...deals, newDeal]);
      setSubmitting(false);
      onClose?.();
    }, 600);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{initialDeal ? 'Edit Deal' : 'New Deal'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form className="deal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Deal Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Company</label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => handleChange('company', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Value ($)</label>
            <input
              type="number"
              value={form.value}
              onChange={handleValueChange}
              min={0}
              required
            />
          </div>

          <div className="form-group">
            <label>Stage</label>
            <select value={form.stage} onChange={(e) => handleChange('stage', e.target.value)}>
              {STAGES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Sales Rep</label>
            <select value={form.repId} onChange={(e) => handleChange('repId', e.target.value)}>
              {REPS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select value={form.priority} onChange={(e) => handleChange('priority', e.target.value)}>
              {['high', 'medium', 'low'].map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
