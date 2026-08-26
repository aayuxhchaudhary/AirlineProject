import { Clock, Users, Edit, Trash2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AscendingPlaneIcon } from './AscendingPlaneIcon';

export const FlightCard = ({ flight, onViewDetails, onEdit, onDelete }) => {
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
    <div className="apple-card p-6 flex flex-col justify-between transition-colors duration-200 relative group border border-[var(--border-subtle)] hover:border-[var(--border-hover)]">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-mono font-bold text-[var(--text-main)] bg-[var(--bg-pill)] px-2.5 py-1 rounded-xl border border-[var(--border-subtle)]">
              #{flight.flightNumber}
            </span>
            <span className="text-sm font-semibold font-display text-[var(--text-main)] truncate max-w-[130px]">
              {flight.airlineName}
            </span>
          </div>
          <span className={`px-3 py-1 text-[9px] uppercase tracking-widest font-mono rounded-full ${getStatusStyle(flight.status)}`}>
            {flight.status || 'SCHEDULED'}
          </span>
        </div>

        <div className="my-5 py-2">
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between w-full">
              <p className="text-2xl font-bold font-display tracking-tight text-[var(--text-main)] truncate max-w-[40%]">
                {flight.source}
              </p>

              <div className="flex-1 px-3 max-w-[100px]">
                <div className="w-full flex items-center justify-center relative">
                  <div className="w-full border-t border-dashed border-[var(--border-hover)]"></div>
                  <AscendingPlaneIcon className="h-5 w-auto text-[var(--text-main)] absolute z-10 px-1.5 bg-[var(--bg-card-solid)]" />
                </div>
              </div>

              <p className="text-2xl font-bold font-display tracking-tight text-[var(--text-main)] truncate max-w-[40%] text-right">
                {flight.destination}
              </p>
            </div>

            <div className="flex items-center justify-between mt-1 w-full">
              <div className="space-y-0.5">
                <p className="text-xs font-mono font-semibold text-[var(--text-sub)] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[var(--text-dim)] shrink-0" />
                  <span>{dep.time}</span>
                </p>
                <p className="text-[10px] font-mono text-[var(--text-dim)] pl-4.5">{dep.date}</p>
              </div>

              <div className="space-y-0.5 text-right">
                <p className="text-xs font-mono font-semibold text-[var(--text-sub)] flex items-center justify-end gap-1">
                  <span>{arr.time}</span>
                  <Clock className="w-3.5 h-3.5 text-[var(--text-dim)] shrink-0" />
                </p>
                <p className="text-[10px] font-mono text-[var(--text-dim)] pr-4.5">{arr.date}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4 p-3 rounded-2xl bg-[var(--bg-pill)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-sub)]">
            <span className="flex items-center space-x-1.5 text-[11px] font-medium">
              <Users className="w-3.5 h-3.5 text-[var(--text-dim)]" />
              <span>Seat Availability</span>
            </span>
            <span className="font-mono text-xs font-bold text-[var(--text-main)]">
              {flight.availableSeats} <span className="text-[var(--text-dim)] font-normal text-[10px]">/ {flight.totalSeats}</span>
            </span>
          </div>

          <div className="w-full bg-[var(--bg-input)] rounded-full h-1.5 overflow-hidden border border-[var(--border-subtle)]">
            <div
              className="bg-[var(--text-main)] h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, seatRatio))}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
        <div>
          <span className="text-[9px] font-mono text-[var(--text-dim)] block uppercase tracking-wider">FARE / SEAT</span>
          <span className="text-xl font-bold font-display text-[var(--text-main)]">₹{formattedPrice}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewDetails(flight)}
            className="apple-btn-primary px-4 py-2 text-xs flex items-center space-x-1.5 shadow-md"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(flight)}
                className="apple-btn-secondary p-2 text-xs hover:border-[var(--border-hover)]"
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
