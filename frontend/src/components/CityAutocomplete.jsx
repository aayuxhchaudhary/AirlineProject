import { useState, useRef, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

export const CityAutocomplete = ({ value = '', onChange, name, className = 'apple-input w-full' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

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

  const handleSelect = (cityName) => {
    onChange({ target: { name, value: cityName } });
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange({ target: { name, value: '' } });
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          name={name}
          value={value}
          onChange={(e) => {
            onChange(e);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className={`${className} ${value ? 'pr-9' : ''}`}
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 text-[var(--text-dim)] hover:text-[var(--text-main)] p-1 rounded-full hover:bg-[var(--bg-pill)]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && filteredCities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 6, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 right-0 z-[100] p-1.5 bg-[var(--bg-card-solid)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl max-h-48 overflow-y-auto"
          >
            {filteredCities.map((city) => (
              <button
                key={city}
                type="button"
                onMouseDown={() => handleSelect(city)}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 text-[var(--text-sub)] hover:bg-[var(--bg-pill)] hover:text-[var(--text-main)] transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[var(--text-dim)] shrink-0" />
                <span>{city}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
