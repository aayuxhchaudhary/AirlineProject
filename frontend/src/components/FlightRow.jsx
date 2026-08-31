import { Clock, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AscendingPlaneIcon } from './AscendingPlaneIcon';

export const FlightRow = ({ flight, onViewDetails, onEdit, onDelete }) => {
  const { isAdmin } = useAuth();

  const formatDateTime = (dateStr) => {
    if (!dateStr) return { date: '', time: '' };
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const dep = formatDateTime(flight.departureTime);
  const arr = formatDateTime(flight.arrivalTime);

  const seatRatio = flight.totalSeats > 0 ? (flight.availableSeats / flight.totalSeats) * 100 : 0;

  const getStatusStyle = (status) => {
    const s = (status || 'SCHEDULED').toUpperCase();
    switch (s) {
      case 'SCHEDULED':
      case 'ON_TIME':
        return 'bg-[var(--btn-main-bg)] text-[var(--btn-main-text)] font-semibold';
      case 'DELAYED':
        return 'bg-[var(--status-warning-bg)] text-[var(--status-warning)] font-semibold';
      case 'CANCELLED':
        return 'bg-[var(--status-danger-bg)] text-[var(--status-danger)] font-semibold';
      default:
        return 'bg-[var(--bg-pill)] text-[var(--text-sub)] border border-[var(--border-subtle)]';
    }
  };

  const formattedPrice = Number.isFinite(Number(flight?.ticketPrice))
    ? Number(flight.ticketPrice).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    : '0.00';

  return (
    <div className="apple-card p-4 sm:py-4.5 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-200 border border-[var(--border-subtle)] hover:border-[var(--border-hover)]">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 min-w-0">
        
        <div className="w-full sm:w-44 md:w-48 shrink-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-mono font-bold text-[var(--text-main)] bg-[var(--bg-pill)] px-2 py-0.5 rounded-lg border border-[var(--border-subtle)]">
              #{flight.flightNumber}
            </span>
            <span className={`px-2 py-0.5 text-[8px] uppercase tracking-widest font-mono rounded-full ${getStatusStyle(flight.status)}`}>
              {(flight.status || 'SCHEDULED').replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm font-semibold font-display text-[var(--text-main)] truncate" title={flight.airlineName}>
            {flight.airlineName}
          </p>
        </div>

        <div className="flex-1 min-w-0 md:px-6">
          <div className="flex items-center justify-between gap-3">
            
            <div className="flex-1 min-w-0 text-left">
              <p className="text-base sm:text-lg font-bold font-display tracking-tight text-[var(--text-main)] truncate">
                {flight.source}
              </p>
              <p className="text-xs font-mono text-[var(--text-sub)] flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3 h-3 text-[var(--text-dim)] shrink-0" />
                <span className="font-semibold text-[var(--text-main)]">{dep.time}</span>
                <span className="text-[10px] text-[var(--text-dim)]">• {dep.date}</span>
              </p>
            </div>

            <div className="w-16 sm:w-24 shrink-0 flex items-center justify-center relative px-1">
              <div className="w-full border-t border-dashed border-[var(--border-hover)]"></div>
              <AscendingPlaneIcon className="h-4 w-auto text-[var(--text-main)] absolute z-10 px-1 bg-[var(--bg-card-solid)] shrink-0" />
            </div>

            <div className="flex-1 min-w-0 text-right">
              <p className="text-base sm:text-lg font-bold font-display tracking-tight text-[var(--text-main)] truncate">
                {flight.destination}
              </p>
              <p className="text-xs font-mono text-[var(--text-sub)] flex items-center justify-end gap-1.5 mt-0.5">
                <span className="text-[10px] text-[var(--text-dim)]">{arr.date} •</span>
                <span className="font-semibold text-[var(--text-main)]">{arr.time}</span>
                <Clock className="w-3 h-3 text-[var(--text-dim)] shrink-0" />
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--border-subtle)] shrink-0">
        
        <div className="w-28 sm:w-32 shrink-0">
          <div className="flex items-center justify-between text-xs text-[var(--text-sub)] mb-1">
            <span className="text-[10px] font-mono text-[var(--text-dim)] uppercase">Seats</span>
            <span className="font-mono text-xs font-bold text-[var(--text-main)]">
              {flight.availableSeats}/{flight.totalSeats}
            </span>
          </div>
          <div className="w-full bg-[var(--bg-input)] rounded-full h-1.5 overflow-hidden border border-[var(--border-subtle)]">
            <div
              className="bg-[var(--text-main)] h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, seatRatio))}%` }}
            ></div>
          </div>
        </div>

        <div className="w-24 sm:w-28 text-right shrink-0">
          <span className="text-[9px] font-mono text-[var(--text-dim)] block uppercase tracking-wider">Fare</span>
          <span className="text-base sm:text-lg font-bold font-display text-[var(--text-main)]">₹{formattedPrice}</span>
        </div>

        <div className="flex items-center space-x-1.5 sm:pl-3 sm:border-l sm:border-[var(--border-subtle)] shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onViewDetails(flight); }}
            className="apple-btn-secondary px-3.5 py-1.5 text-xs font-semibold"
          >
            Details
          </button>

          {isAdmin && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(flight); }}
                className="apple-btn-icon p-1.5 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
                aria-label="Edit flight"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(flight); }}
                className="apple-btn-icon p-1.5 rounded-lg border border-[var(--border-subtle)] hover:!border-red-500/30 hover:!bg-red-500/10 hover:!text-red-500 text-[var(--status-danger)]"
                aria-label="Delete flight"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
