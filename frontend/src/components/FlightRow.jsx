import { Clock, Users, Edit, Trash2, ArrowRight } from 'lucide-react';
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
      case 'ON TIME':
        return 'bg-[var(--btn-main-bg)] text-[var(--btn-main-text)] font-semibold';
      case 'DELAYED':
        return 'bg-[var(--status-warning-bg)] text-[var(--status-warning)] font-semibold';
      case 'CANCELLED':
        return 'bg-[var(--status-danger-bg)] text-[var(--status-danger)] font-semibold';
      default:
        return 'bg-[var(--bg-pill)] text-[var(--text-sub)] border border-[var(--border-subtle)]';
    }
  };

  const formattedPrice = Number(flight.ticketPrice || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <div className="apple-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-200 border border-[var(--border-subtle)] hover:border-[var(--border-hover)]">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
        <div className="min-w-[130px]">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-mono font-bold text-[var(--text-main)] bg-[var(--bg-pill)] px-2 py-0.5 rounded-lg border border-[var(--border-subtle)]">
              #{flight.flightNumber}
            </span>
            <span className={`px-2 py-0.5 text-[8px] uppercase tracking-widest font-mono rounded-full ${getStatusStyle(flight.status)}`}>
              {flight.status || 'SCHEDULED'}
            </span>
          </div>
          <p className="text-sm font-semibold font-display text-[var(--text-main)] truncate max-w-[150px]">
            {flight.airlineName}
          </p>
        </div>

        <div className="flex items-center space-x-4 flex-1">
          <div className="min-w-[110px]">
            <p className="text-lg font-bold font-display tracking-tight text-[var(--text-main)] truncate">
              {flight.source}
            </p>
            <p className="text-xs font-mono text-[var(--text-sub)] flex items-center gap-1">
              <Clock className="w-3 h-3 text-[var(--text-dim)] shrink-0" />
              <span>{dep.time}</span>
              <span className="text-[10px] text-[var(--text-dim)]">({dep.date})</span>
            </p>
          </div>

          <div className="flex flex-col items-center flex-1 max-w-[120px]">
            <div className="w-full flex items-center justify-center relative my-1">
              <div className="w-full border-t border-dashed border-[var(--border-hover)]"></div>
              <AscendingPlaneIcon className="h-4 w-auto text-[var(--text-main)] absolute z-10 px-1.5 bg-[var(--bg-card-solid)]" />
            </div>
          </div>

          <div className="min-w-[110px] text-right">
            <p className="text-lg font-bold font-display tracking-tight text-[var(--text-main)] truncate">
              {flight.destination}
            </p>
            <p className="text-xs font-mono text-[var(--text-sub)] flex items-center justify-end gap-1">
              <span>{arr.time}</span>
              <Clock className="w-3 h-3 text-[var(--text-dim)] shrink-0" />
              <span className="text-[10px] text-[var(--text-dim)]">({arr.date})</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--border-subtle)]">
        <div className="min-w-[110px]">
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

        <div className="text-right min-w-[95px]">
          <span className="text-[9px] font-mono text-[var(--text-dim)] block uppercase tracking-wider">Fare</span>
          <span className="text-lg font-bold font-display text-[var(--text-main)]">₹{formattedPrice}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewDetails(flight)}
            className="apple-btn-primary px-3.5 py-2 text-xs flex items-center space-x-1.5 shadow-md"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(flight)}
                className="apple-btn-secondary p-2 text-xs hover:border-[var(--border-hover)]"
                title="Edit Flight"
                aria-label="Edit flight"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(flight)}
                className="apple-btn-secondary p-2 text-xs text-[var(--status-danger)] hover:border-[var(--status-danger)]/30 hover:bg-[var(--status-danger-bg)]"
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
