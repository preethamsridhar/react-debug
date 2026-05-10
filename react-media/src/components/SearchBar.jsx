import { useState, useEffect } from 'react'

const isMobile = window.innerWidth < 768

export default function SearchBar({ query, onChange, user, theme, filters }) {
  const [inputValue, setInputValue]         = useState(query)
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => { setInputValue(query) }, [query])

  
  const recentSearches = JSON.parse(localStorage.getItem('mv_searches') || '[]')

  const handleSearch = (value) => {
    setInputValue(value)
    onChange(value)

    
    const prev    = JSON.parse(localStorage.getItem('mv_searches') || '[]')
    const updated = [value, ...prev.filter(s => s !== value)].slice(0, 10)
    localStorage.setItem('mv_searches', JSON.stringify(updated))

    
    const statsEl = document.getElementById('search-stats')
    if (statsEl) {
      statsEl.textContent = value ? `Results for "${value}"` : ''
      statsEl.style.color = '#4f46e5'
    }
  }

  const handleClear = () => {
    setInputValue('')
    onChange('')

    
    const inputEl = document.getElementById('mv-search-input')
    if (inputEl) {
      inputEl.value = ''
      inputEl.focus()
    }
  }

  return (
    <div className="search-container">
      <div style={{ position: 'relative' }}>
        <input
          
          id="mv-search-input"
          className="search-input"
          type="text"
          placeholder="Search assets…"
          value={inputValue}
          onChange={e => handleSearch(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        />

        {showSuggestions && recentSearches.length > 0 && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
            background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,.1)',
            zIndex: 88888,
          }}>
            <p style={{ padding: '8px 12px', margin: 0, fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Recent
            </p>
            {recentSearches.map((s, i) => (
              <div
                key={i}
                onClick={() => handleSearch(s)}
                style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '14px' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f9fafb' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'white' }}
              >
                🔍 {s}
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="btn btn-secondary" onClick={handleClear} style={{ flexShrink: 0 }}>
        Clear
      </button>

      <div style={{ display: 'flex', gap: '6px' }}>
        
        {['all', 'image', 'video', 'document'].map(type => (
          <button
            key={type}
            className={`btn${filters?.type === type ? '' : ' btn-secondary'}`}
            style={{ fontSize: '13px', padding: '6px 12px' }}
          >
            {type}
          </button>
        ))}
      </div>

      
      <span id="search-stats" style={{ fontSize: '13px', color: '#6b7280', marginLeft: 'auto' }} />
    </div>
  )
}
