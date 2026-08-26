import { useState, useRef, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';

const POPULAR_CITIES = [
  'Delhi',
  'Mumbai',
  'Bengaluru',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Ahmedabad',
  'Pune',
  'Jaipur',
  'Goa',
  'Chandigarh',
  'Lucknow',
  'Kochi',
  'Guwahati',
  'Varanasi',
  'Amritsar',
  'Dubai',
  'London',
  'Singapore',
  'New York',
  'Tokyo',
  'Frankfurt',
  'Bangkok',
  'Sydney',
  'Paris'
];

export const CityAutocomplete = ({ value = '', onChange, name, id, className = 'apple-input w-full' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const listId = `${id || name}-listbox`;

  const filteredCities = POPULAR_CITIES.filter((city) =>
    city.toLowerCase().includes((value || '').trim().toLowerCase())
  );

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
          onFocus={() => setIsOpen(true)}
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

      <>
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
                onMouseDown={() => handleSelect(city)}
                onMouseEnter={() => setActiveIndex(index)}
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
      </>
    </div>
  );
};
