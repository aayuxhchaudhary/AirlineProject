import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const CustomSelect = ({ value, onChange, options, name, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const listId = `${id || name}-listbox`;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else if (activeIndex >= 0) {
        onChange({ target: { name, value: options[activeIndex].value } });
        setIsOpen(false);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setActiveIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        id={id}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className="apple-input w-full flex items-center justify-between text-left cursor-pointer"
      >
        <span className="font-medium text-[var(--text-main)]">
          {selectedOption ? selectedOption.label : value}
        </span>
        <ChevronDown className={`w-4 h-4 text-[var(--text-dim)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <>
        {isOpen && (
          <ul
            id={listId}
            role="listbox"
            className="animate-dropdown absolute left-0 right-0 z-50 p-1 bg-[var(--bg-card-solid)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl max-h-56 overflow-y-auto mt-1"
          >
            {options.map((opt, index) => {
              const isSelected = opt.value === value;
              return (
                <li
                  key={opt.value}
                  id={`${listId}-option-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange({ target: { name, value: opt.value } });
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[var(--bg-pill)] text-[var(--text-main)]'
                      : index === activeIndex
                        ? 'bg-[var(--bg-pill)] text-[var(--text-main)]'
                        : 'text-[var(--text-sub)] hover:bg-[var(--bg-pill)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[var(--text-main)]" />}
                </li>
              );
            })}
          </ul>
        )}
      </>
    </div>
  );
};
