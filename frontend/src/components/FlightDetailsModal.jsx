import { MapPin, Tag, Hash, Users, Activity, X } from 'lucide-react';
import { AscendingPlaneIcon } from './AscendingPlaneIcon';

export const FlightDetailsModal = ({ isOpen, flight, onClose }) => {
  if (!flight) return null;

  const formatDateTime = (dateStr) => {
    if (!dateStr) return { date: '', time: '' };
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const dep = formatDateTime(flight.departureTime);
  const arr = formatDateTime(flight.arrivalTime);

  const seatRatio = flight.totalSeats > 0 ? (flight.availableSeats / flight.totalSeats) * 100 : 0;
  const isFull = flight.availableSeats === 0;

  const getStatusColor = (status) => {
    const s = (status || 'SCHEDULED').toUpperCase();
    switch (s) {
      case 'SCHEDULED':
      case 'ON_TIME':
        return 'text-[var(--status-success)]';
      case 'DELAYED':
        return 'text-[var(--status-warning)]';
      case 'CANCELLED':
        return 'text-[var(--status-danger)]';
      default:
        return 'text-[var(--text-sub)]';
    }
  };

  const formattedPrice = Number.isFinite(Number(flight?.ticketPrice))
    ? Number(flight.ticketPrice).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    : '0.00';

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            onClick={onClose}
            className="animate-fade fixed inset-0 bg-[var(--backdrop)] backdrop-blur-md"
          />

          <div
            className="animate-modal apple-glass w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 my-8 overflow-hidden"
          >
            <div className="bg-[var(--bg-pill)] border-b border-[var(--border-subtle)] p-6">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-[var(--text-dim)] hover:text-[var(--text-main)] p-2 rounded-xl hover:bg-[var(--bg-card)]"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 mb-2">
                <span className="px-3 py-1 rounded-xl bg-[var(--bg-card-solid)] border border-[var(--border-subtle)] text-xs font-mono font-bold text-[var(--text-main)] shadow-sm">
                  {flight.flightNumber}
                </span>
                <span className="text-sm font-medium text-[var(--text-sub)]">{flight.airlineName}</span>
              </div>

              <h2 className="text-2xl font-bold font-display text-[var(--text-main)] flex items-center gap-3">
                {flight.source}
                <AscendingPlaneIcon className="w-6 h-6 text-[var(--text-sub)]" />
                {flight.destination}
              </h2>
            </div>

            <div className="p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-[var(--border-subtle)] -translate-x-1/2"></div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2.5 bg-[var(--bg-pill)] rounded-xl text-[var(--text-main)] border border-[var(--border-subtle)]">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-wider mb-0.5">Departure</p>
                      <p className="text-lg font-bold font-display text-[var(--text-main)]">{flight.source}</p>
                      <p className="text-xs text-[var(--text-sub)]">{dep.date}</p>
                      <p className="text-xs font-mono font-semibold text-[var(--text-main)] mt-0.5">{dep.time}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2.5 bg-[var(--bg-pill)] rounded-xl text-[var(--text-main)] border border-[var(--border-subtle)]">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-wider mb-0.5">Arrival</p>
                      <p className="text-lg font-bold font-display text-[var(--text-main)]">{flight.destination}</p>
                      <p className="text-xs text-[var(--text-sub)]">{arr.date}</p>
                      <p className="text-xs font-mono font-semibold text-[var(--text-main)] mt-0.5">{arr.time}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[var(--bg-pill)] rounded-2xl border border-[var(--border-subtle)]">
                <div>
                  <p className="text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Activity className="w-3 h-3" /> Status
                  </p>
                  <p className={`text-sm font-bold ${getStatusColor(flight.status)}`}>
                    {(flight.status || 'SCHEDULED').replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Price
                  </p>
                  <p className="text-sm font-bold font-mono text-[var(--text-main)]">₹{formattedPrice}</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Hash className="w-3 h-3" /> Flight No
                  </p>
                  <p className="text-sm font-bold text-[var(--text-main)]">{flight.flightNumber}</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Users className="w-3 h-3" /> Capacity
                  </p>
                  <p className="text-sm font-bold text-[var(--text-main)]">{flight.totalSeats} seats</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-[var(--text-sub)] mb-2">
                  <span className="font-semibold text-[var(--text-main)]">Seat Availability</span>
                  <span className="font-mono text-xs font-bold text-[var(--text-main)]">
                    {flight.availableSeats} <span className="text-[var(--text-dim)] font-normal">/ {flight.totalSeats}</span>
                  </span>
                </div>
                <div className="w-full bg-[var(--bg-pill)] rounded-full h-2 overflow-hidden border border-[var(--border-subtle)]">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${isFull ? 'bg-[var(--status-danger)]' : 'bg-[var(--text-main)]'}`}
                    style={{ width: `${Math.min(100, Math.max(0, seatRatio))}%` }}
                  ></div>
                </div>
                {isFull && <p className="text-xs text-[var(--status-danger)] mt-2 font-semibold">Flight is fully booked</p>}
              </div>
            </div>

            <div className="bg-[var(--bg-pill)] border-t border-[var(--border-subtle)] p-4 flex justify-end">
              <button
                onClick={onClose}
                className="apple-btn-primary py-2 px-5 text-xs shadow-md"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
