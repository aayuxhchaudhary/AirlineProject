import { useState, useEffect } from 'react';
import { X, Plus, Edit3, Loader2 } from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import { CityAutocomplete } from './CityAutocomplete';

export const FlightFormModal = ({ isOpen, initialData, onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    flightNumber: '',
    airlineName: '',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    totalSeats: 180,
    availableSeats: 180,
    ticketPrice: 4500,
    status: 'SCHEDULED'
  });

  const [formError, setFormError] = useState('');

  const nowString = new Date().toISOString().slice(0, 16);

  const statusOptions = [
    { value: 'SCHEDULED', label: 'SCHEDULED' },
    { value: 'DELAYED', label: 'DELAYED' },
    { value: 'CANCELLED', label: 'CANCELLED' },
    { value: 'COMPLETED', label: 'COMPLETED' }
  ];

  useEffect(() => {
    setFormError('');
    if (initialData) {
      setFormData({
        flightNumber: initialData.flightNumber || '',
        airlineName: initialData.airlineName || '',
        source: initialData.source || '',
        destination: initialData.destination || '',
        departureTime: initialData.departureTime ? initialData.departureTime.slice(0, 16) : '',
        arrivalTime: initialData.arrivalTime ? initialData.arrivalTime.slice(0, 16) : '',
        totalSeats: initialData.totalSeats || 180,
        availableSeats: initialData.availableSeats || 180,
        ticketPrice: initialData.ticketPrice ? Number(initialData.ticketPrice) : 4500,
        status: initialData.status || 'SCHEDULED'
      });
    } else {
      setFormData({
        flightNumber: '',
        airlineName: '',
        source: '',
        destination: '',
        departureTime: '',
        arrivalTime: '',
        totalSeats: 180,
        availableSeats: 180,
        ticketPrice: 4500,
        status: 'SCHEDULED'
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormError('');
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.source.trim() && formData.destination.trim() && formData.source.trim().toLowerCase() === formData.destination.trim().toLowerCase()) {
      setFormError('Source and Destination cities cannot be identical.');
      return;
    }

    const dep = new Date(formData.departureTime);
    const arr = new Date(formData.arrivalTime);

    if (isNaN(dep.getTime())) {
      setFormError('Please select a valid departure date and time.');
      return;
    }

    if (isNaN(arr.getTime())) {
      setFormError('Please select a valid arrival date and time.');
      return;
    }

    if (dep < new Date(Date.now() - 60000)) {
      setFormError('Departure time cannot be in the past.');
      return;
    }

    if (arr <= dep) {
      setFormError('Arrival time must be after departure time.');
      return;
    }

    const total = Number(formData.totalSeats);
    const avail = Number(formData.availableSeats);

    if (avail > total) {
      setFormError(`Available seats (${avail}) cannot exceed total capacity (${total}).`);
      return;
    }

    const payload = {
      ...formData,
      totalSeats: total,
      availableSeats: avail,
      ticketPrice: Number(formData.ticketPrice)
    };
    onSubmit(payload);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            onClick={onClose}
            className="animate-fade fixed inset-0 bg-[var(--backdrop)] backdrop-blur-md"
          />

          <div
            className="animate-modal apple-card w-full max-w-xl rounded-3xl p-6 shadow-2xl relative z-10 my-8"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[var(--text-dim)] hover:text-[var(--text-main)] p-2 rounded-xl hover:bg-[var(--bg-pill)]"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-[var(--btn-main-bg)] text-[var(--btn-main-text)] rounded-2xl font-bold shadow-sm">
                {initialData ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-[var(--text-main)]">
                  {initialData ? 'Edit Flight Details' : 'Create New Flight'}
                </h3>
                <p className="text-xs text-[var(--text-sub)]">
                  {initialData ? 'Update existing flight information' : 'Add new flight schedule to system'}
                </p>
              </div>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-[var(--status-danger-bg)] border border-[var(--status-danger)]/30 rounded-xl text-xs font-semibold text-[var(--status-danger)]">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="flightNumber" className="block text-[10px] font-mono font-bold text-[var(--text-dim)] mb-1.5 uppercase tracking-widest">
                    Flight Number *
                  </label>
                  <input
                    id="flightNumber"
                    type="text"
                    name="flightNumber"
                    required
                    value={formData.flightNumber}
                    onChange={handleChange}
                    className="apple-input w-full"
                  />
                </div>

                <div>
                  <label htmlFor="airlineName" className="block text-[10px] font-mono font-bold text-[var(--text-dim)] mb-1.5 uppercase tracking-widest">
                    Airline Name *
                  </label>
                  <input
                    id="airlineName"
                    type="text"
                    name="airlineName"
                    required
                    value={formData.airlineName}
                    onChange={handleChange}
                    className="apple-input w-full"
                  />
                </div>

                <div>
                  <label htmlFor="source" className="block text-[10px] font-mono font-bold text-[var(--text-dim)] mb-1.5 uppercase tracking-widest">
                    Source *
                  </label>
                  <CityAutocomplete
                    id="source"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="destination" className="block text-[10px] font-mono font-bold text-[var(--text-dim)] mb-1.5 uppercase tracking-widest">
                    Destination *
                  </label>
                  <CityAutocomplete
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="departureTime" className="block text-[10px] font-mono font-bold text-[var(--text-dim)] mb-1.5 uppercase tracking-widest">
                    Departure Time *
                  </label>
                  <input
                    id="departureTime"
                    type="datetime-local"
                    name="departureTime"
                    min={nowString}
                    required
                    value={formData.departureTime}
                    onChange={handleChange}
                    className="apple-input w-full"
                  />
                </div>

                <div>
                  <label htmlFor="arrivalTime" className="block text-[10px] font-mono font-bold text-[var(--text-dim)] mb-1.5 uppercase tracking-widest">
                    Arrival Time *
                  </label>
                  <input
                    id="arrivalTime"
                    type="datetime-local"
                    name="arrivalTime"
                    min={formData.departureTime || nowString}
                    required
                    value={formData.arrivalTime}
                    onChange={handleChange}
                    className="apple-input w-full"
                  />
                </div>

                <div>
                  <label htmlFor="totalSeats" className="block text-[10px] font-mono font-bold text-[var(--text-dim)] mb-1.5 uppercase tracking-widest">
                    Total Seats *
                  </label>
                  <input
                    id="totalSeats"
                    type="number"
                    name="totalSeats"
                    min="1"
                    required
                    value={formData.totalSeats}
                    onChange={handleChange}
                    className="apple-input w-full"
                  />
                </div>

                <div>
                  <label htmlFor="availableSeats" className="block text-[10px] font-mono font-bold text-[var(--text-dim)] mb-1.5 uppercase tracking-widest">
                    Available Seats *
                  </label>
                  <input
                    id="availableSeats"
                    type="number"
                    name="availableSeats"
                    min="0"
                    max={formData.totalSeats}
                    required
                    value={formData.availableSeats}
                    onChange={handleChange}
                    className="apple-input w-full"
                  />
                </div>

                <div>
                  <label htmlFor="ticketPrice" className="block text-[10px] font-mono font-bold text-[var(--text-dim)] mb-1.5 uppercase tracking-widest">
                    Ticket Price (₹) *
                  </label>
                  <input
                    id="ticketPrice"
                    type="number"
                    step="0.01"
                    name="ticketPrice"
                    min="0"
                    required
                    value={formData.ticketPrice}
                    onChange={handleChange}
                    className="apple-input w-full"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-[10px] font-mono font-bold text-[var(--text-dim)] mb-1.5 uppercase tracking-widest">
                    Status *
                  </label>
                  <CustomSelect
                    id="status"
                    name="status"
                    value={formData.status}
                    options={statusOptions}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="apple-btn-secondary py-2.5 px-4 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="apple-btn-primary py-2.5 px-5 text-xs flex items-center space-x-2 shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[var(--btn-main-text)]" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{initialData ? 'Update Flight' : 'Create Flight'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
