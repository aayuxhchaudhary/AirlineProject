import { useState, useRef, useEffect, useMemo } from 'react';
import { MapPin, X } from 'lucide-react';

const FALLBACK_CITIES = [
  'Ahmedabad', 'Bangalore', 'Bangkok', 'Bengaluru', 'Berlin',
  'Chennai', 'Delhi', 'Dubai', 'Frankfurt', 'Goa', 'Guwahati',
  'Hong Kong', 'Hyderabad', 'Jaipur', 'Kolkata', 'Kuala Lumpur',
  'London', 'Lucknow', 'Mumbai', 'New York', 'Paris', 'Pune',
  'Seoul', 'Singapore', 'Sydney', 'Tokyo', 'Toronto', 'Zurich'
];

let cachedCities = null;
let fetchPromise = null;

const loadCities = async () => {
  if (cachedCities) return cachedCities;
  if (!fetchPromise) {
    fetchPromise = fetch('/api/flights/cities')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const set = new Set([...(Array.isArray(data) ? data : []), ...FALLBACK_CITIES]);
        cachedCities = Array.from(set).sort((a, b) => a.localeCompare(b));
        return cachedCities;
      })
      .catch(() => {
        cachedCities = FALLBACK_CITIES;
        return cachedCities;
      });
  }
  return fetchPromise;
};

export const CityAutocomplete = ({ value = '', onChange, name, id, className = 'apple-input w-full' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [availableCities, setAvailableCities] = useState(cachedCities || FALLBACK_CITIES);
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const listId = `${id || name}-listbox`;

  useEffect(() => {
    loadCities().then(cities => {
      setAvailableCities(cities);
    });
  }, []);

  const filteredCities = useMemo(() => {
    const q = (value || '').trim().toLowerCase();
    if (!q) return availableCities.slice(0, 10);

    const prefixMatches = [];
    const wordMatches = [];
    const substringMatches = [];

    for (let i = 0; i < availableCities.length; i++) {
      const city = availableCities[i];
      const lower = city.toLowerCase();

      if (lower.startsWith(q)) {
        prefixMatches.push(city);
      } else if (lower.includes(' ' + q) || lower.includes('-' + q)) {
        wordMatches.push(city);
      } else if (lower.includes(q)) {
        substringMatches.push(city);
      }
    }

    return [...prefixMatches, ...wordMatches, ...substringMatches].slice(0, 10);
  }, [availableCities, value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [value]);

  const handleSelect = (cityName) => {
    onChange({ target: { name, value: cityName } });
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange({ target: { name, value: '' } });
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || filteredCities.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < filteredCities.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredCities.length - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(filteredCities[activeIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          id={id}
          name={name}
          value={value}
          role="combobox"
          aria-expanded={isOpen && filteredCities.length > 0}
          aria-controls={listId}
          aria-activedescendant={activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined}
          aria-autocomplete="list"
          onChange={(e) => {
            onChange(e);
            setIsOpen(true);
          }}
          onFocus={() => {
            loadCities().then(setAvailableCities);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Enter city..."
          className={`${className} ${value ? 'pr-9' : ''}`}
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear city selection"
            className="apple-btn-icon absolute right-2 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isOpen && filteredCities.length > 0 && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className="animate-dropdown absolute left-0 right-0 z-[100] p-1.5 bg-[var(--bg-card-solid)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl max-h-48 overflow-y-auto mt-2"
        >
          {filteredCities.map((city, index) => (
            <li
              key={city}
              id={`${listId}-option-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(city);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 cursor-pointer transition-colors ${
                index === activeIndex
                  ? 'bg-[var(--bg-pill)] text-[var(--text-main)]'
                  : 'text-[var(--text-sub)] hover:bg-[var(--bg-pill)] hover:text-[var(--text-main)]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[var(--text-dim)] shrink-0" />
              <span>{city}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
