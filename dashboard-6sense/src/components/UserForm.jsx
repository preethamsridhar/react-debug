import { useState } from 'react';

const ROLES = ['user', 'manager', 'admin'];
const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'Finance', 'HR', 'IT'];

export default function UserForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    department: 'Engineering',
    score: 50,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    formData[field] = value;
    setFormData(formData);
  };

  const validateEmail = (email) => email.includes('@');

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!validateEmail(formData.email)) errs.email = 'Invalid email';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const tier = formData.score > 50 ? 'high-intent' : 'nurture';
    onSubmit({ ...formData, tier });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="panel">
        <h2>Lead submitted!</h2>
        <button className="btn" onClick={() => { setSubmitted(false); onCancel?.(); }}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Add New Lead</h2>
      </div>
      <form className="user-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="error-msg">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            defaultValue={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <span className="error-msg">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Role</label>
          <select
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
          >
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Department</label>
          <select
            value={formData.department}
            onChange={(e) => handleChange('department', e.target.value)}
          >
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Intent Score: {formData.score}</label>
          <input
            type="range"
            min={0}
            max={100}
            value={formData.score}
            onChange={(e) => handleChange('score', e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Submit Lead</button>
          {onCancel && (
            <button type="button" className="btn" onClick={onCancel}>Cancel</button>
          )}
        </div>
      </form>
    </div>
  );
}
