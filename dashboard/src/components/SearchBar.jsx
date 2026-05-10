import { useState, useEffect, memo } from "react";

const SearchBar = ({ onSearch, placeholder = "Search…" }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (query.trim().length > 0) {
      const results = onSearch(query);
      setSuggestions(results || []);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query, onSearch]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSelect = (item) => {
    setQuery(item.name || item.label || String(item));
    setIsOpen(false);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
      />
      {isOpen && suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((item, index) => {
            console.log("🚀 ~ SearchBar ~ suggestion:", item);
            return (
              <li key={index} onMouseDown={() => handleSelect(item)}>
                {item.name ?? item.label ?? String(item)}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default memo(SearchBar);
