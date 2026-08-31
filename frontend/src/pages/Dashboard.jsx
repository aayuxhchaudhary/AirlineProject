import { useState, useEffect, useRef } from 'react';
import { Search, RefreshCw, Loader2, LayoutList, LayoutGrid } from 'lucide-react';
import { FlightCard } from '../components/FlightCard';
import { FlightRow } from '../components/FlightRow';
import { FlightDetailsModal } from '../components/FlightDetailsModal';
import { FlightFormModal } from '../components/FlightFormModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { Toast } from '../components/Toast';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { CityAutocomplete } from '../components/CityAutocomplete';
import { CustomSelect } from '../components/CustomSelect';
import { useAuth } from '../context/AuthContext';

export const Dashboard = ({ isCreateModalOpen, setIsCreateModalOpen, onShowToast, toast, setToast }) => {
  const { isAdmin } = useAuth();
  const [flights, setFlights] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState('list');

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('');


  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [editFlightData, setEditFlightData] = useState(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const abortControllerRef = useRef(null);

  const fetchFlights = async ({
    isFirstLoad = false,
    page = currentPage,
    sortField = sortBy,
    sortDir = sortDirection,
    searchMode = isSearching,
    src = source,
    dest = destination,
    status = filterStatus
  } = {}) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    if (isFirstLoad) setInitialLoading(true);

    try {
      const statusParam = status ? `&status=${status}` : '';
      let url;
      if (searchMode && (src.trim() || dest.trim())) {
        url = `/api/flights/search?source=${encodeURIComponent(src.trim())}&destination=${encodeURIComponent(dest.trim())}&page=${page}&size=12&sortBy=${sortField}&direction=${sortDir}${statusParam}`;
      } else {
        url = `/api/flights?page=${page}&size=12&sortBy=${sortField}&direction=${sortDir}${statusParam}`;
      }

      const response = await fetch(url, { signal });
      if (!response.ok) throw new Error('Failed to fetch flight schedules');
      const data = await response.json();
      setFlights(data.content || []);
      setTotalPages(data.page?.totalPages ?? data.totalPages ?? 1);
      setTotalElements(data.page?.totalElements ?? data.totalElements ?? 0);
    } catch (err) {
      if (err.name === 'AbortError') return;
      onShowToast({ type: 'error', message: err.message || 'Unable to connect to flight server' });
    } finally {
      if (isFirstLoad) setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights({ isFirstLoad: true });
    return () => { abortControllerRef.current?.abort(); };
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!source.trim() && !destination.trim()) {
      handleResetSearch();
      return;
    }

    if (source.trim() && destination.trim() && source.trim().toLowerCase() === destination.trim().toLowerCase()) {
      onShowToast({ type: 'error', message: 'Source and Destination cities cannot be the same' });
      return;
    }

    setSearchLoading(true);
    setIsSearching(true);
    setCurrentPage(0);
    try {
      const statusParam = filterStatus ? `&status=${filterStatus}` : '';
      const response = await fetch(`/api/flights/search?source=${encodeURIComponent(source.trim())}&destination=${encodeURIComponent(destination.trim())}&page=0&size=12&sortBy=${sortBy}&direction=${sortDirection}${statusParam}`);
      if (!response.ok) throw new Error('Failed to execute route search');
      const data = await response.json();
      setFlights(data.content || []);
      setTotalPages(data.page?.totalPages ?? data.totalPages ?? 1);
      setTotalElements(data.page?.totalElements ?? data.totalElements ?? 0);

      const routeDesc = [source.trim(), destination.trim()].filter(Boolean).join(' → ');
      const total = data.page?.totalElements ?? data.totalElements ?? data.content?.length ?? 0;
      if ((data.content || []).length > 0) {
        onShowToast({
          type: 'success',
          message: `Found ${total} flight${total === 1 ? '' : 's'} matching "${routeDesc}"`
        });
      } else {
        onShowToast({ type: 'error', message: `No flights found matching route "${routeDesc}"` });
      }
    } catch (err) {
      onShowToast({ type: 'error', message: err.message || 'Error executing search query' });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleResetSearch = async () => {
    setSource('');
    setDestination('');
    setIsSearching(false);
    setCurrentPage(0);
    setFilterStatus('');
    setSearchLoading(true);
    await fetchFlights({ isFirstLoad: false, page: 0, searchMode: false, src: '', dest: '', status: '' });
    setSearchLoading(false);
    onShowToast({ type: 'info', message: 'Search filters reset to all flights' });
  };

  const handleFormSubmit = async (formData) => {
    setIsFormSubmitting(true);
    try {
      const isEdit = !!editFlightData;
      const url = isEdit ? `/api/flights/${editFlightData.id}` : '/api/flights';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      let data;
      try { data = await response.json(); } catch { data = {}; }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save flight schedule');
      }

      const savedFlightNum = data.data?.flightNumber || data.flightNumber || formData.flightNumber;

      onShowToast({
        type: 'success',
        message: isEdit
          ? `Flight ${savedFlightNum} updated successfully`
          : `Flight ${savedFlightNum} created successfully`
      });

      setIsCreateModalOpen(false);
      setEditFlightData(null);
      setCurrentPage(0);
      fetchFlights({ isFirstLoad: false, page: 0, sortField: sortBy, sortDir: sortDirection, searchMode: isSearching, status: filterStatus });
    } catch (err) {
      onShowToast({ type: 'error', message: err.message || 'Operation failed' });
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const response = await fetch(`/api/flights/${deleteTarget.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete flight');

      onShowToast({ type: 'success', message: `Flight ${deleteTarget.flightNumber} removed successfully` });

      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
      const isLastItemOnPage = flights.length === 1 && currentPage > 0;
      const targetPage = isLastItemOnPage ? currentPage - 1 : currentPage;
      if (isLastItemOnPage) {
        setCurrentPage(targetPage);
      }
      fetchFlights({ isFirstLoad: false, page: targetPage, searchMode: isSearching, status: filterStatus });
    } catch (err) {
      onShowToast({ type: 'error', message: err.message || 'Failed to delete flight' });
    }
  };


  const handleViewDetails = (f) => {
    setSelectedFlight(f);
    setIsDetailsOpen(true);
  };

  const handleEdit = (f) => {
    setEditFlightData(f);
    setIsCreateModalOpen(true);
  };

  const handleDelete = (f) => {
    setDeleteTarget(f);
    setIsDeleteModalOpen(true);
  };

  const renderFlightList = () => (
    <div className="flex flex-col gap-3.5">
      {flights.map((flight) => (
        <FlightRow
          key={flight.id}
          flight={flight}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );

  const renderFlightGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {flights.map((flight) => (
        <FlightCard
          key={flight.id}
          flight={flight}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );

  const renderContent = () => {
    if (initialLoading) {
      return <LoadingSkeleton count={6} viewMode={viewMode} />;
    }

    if (flights.length === 0) {
      return (
        <div className="w-full flex justify-center py-8">
          <EmptyState
            message={isSearching ? `No flights found matching route "${source}" to "${destination}".` : "No flights registered in system database."}
            onReset={isSearching ? handleResetSearch : undefined}
          />
        </div>
      );
    }

    return viewMode === 'list' ? renderFlightList() : renderFlightGrid();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-20 bg-[var(--bg-app)] text-[var(--text-main)]">
      <section className="pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-30">
        <div className="apple-glass p-6 sm:p-8">
          <div className="mb-6 pb-6 border-b border-[var(--border-subtle)]">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] tracking-tight uppercase font-display">
              Explore Flight Schedules
            </h1>
          </div>

          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="source-city" className="block text-[10px] font-mono font-semibold text-[var(--text-dim)] uppercase tracking-widest mb-1.5">
                Source City
              </label>
              <CityAutocomplete
                id="source-city"
                name="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="destination-city" className="block text-[10px] font-mono font-semibold text-[var(--text-dim)] uppercase tracking-widest mb-1.5">
                Destination City
              </label>
              <CityAutocomplete
                id="destination-city"
                name="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="flex items-end space-x-2">
              <button
                type="submit"
                disabled={searchLoading}
                className="apple-btn-primary flex-1 py-3 px-5 text-xs uppercase tracking-wider disabled:opacity-50"
              >
                {searchLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Searching…</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search Routes</span>
                  </>
                )}
              </button>

              {isSearching && (
                <button
                  type="button"
                  onClick={handleResetSearch}
                  disabled={searchLoading}
                  className="apple-btn-icon p-3 border border-[var(--border-subtle)] rounded-[var(--radius-md)] disabled:opacity-50"
                  aria-label="Reset search filters"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 mb-6 pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center justify-between sm:justify-start space-x-3">
            <h2 className="text-xs font-bold text-[var(--text-main)] tracking-widest uppercase font-display">
              Available Schedules
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--bg-pill)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-sub)]">
              {initialLoading ? '—' : totalElements}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
            <div className="flex items-center space-x-1.5 flex-1 sm:flex-initial">
              <label className="text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-wider hidden md:block">Sort By</label>
              <div className="w-full sm:w-auto sm:min-w-[150px]">
                <CustomSelect
                  id="sortSelect"
                  name="sortSelect"
                  value={`${sortBy}-${sortDirection}`}
                  onChange={(e) => {
                    const [newSortBy, newSortDir] = e.target.value.split('-');
                    setSortBy(newSortBy);
                    setSortDirection(newSortDir);
                    setCurrentPage(0);
                    fetchFlights({ isFirstLoad: true, page: 0, sortField: newSortBy, sortDir: newSortDir, searchMode: isSearching });
                  }}
                  options={[
                    { value: 'id-desc', label: 'Newly Added' },
                    { value: 'ticketPrice-asc', label: 'Price: Low → High' },
                    { value: 'ticketPrice-desc', label: 'Price: High → Low' },
                    { value: 'departureTime-asc', label: 'Departure: Earliest' },
                    { value: 'departureTime-desc', label: 'Departure: Latest' },
                  ]}
                />
              </div>
            </div>

            <div className="flex items-center space-x-1.5 flex-1 sm:flex-initial">
              <label className="text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-wider hidden md:block">Status</label>
              <div className="w-full sm:w-auto sm:min-w-[125px]">
                <CustomSelect
                  id="filterStatus"
                  name="filterStatus"
                  value={filterStatus}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    setFilterStatus(newStatus);
                    setCurrentPage(0);
                    fetchFlights({ isFirstLoad: true, page: 0, sortField: sortBy, sortDir: sortDirection, searchMode: isSearching, status: newStatus });
                  }}
                  options={[
                    { value: '', label: 'All Statuses' },
                    { value: 'SCHEDULED', label: 'Scheduled' },
                    { value: 'ON_TIME', label: 'On Time' },
                    { value: 'DELAYED', label: 'Delayed' },
                    { value: 'CANCELLED', label: 'Cancelled' },
                  ]}
                />
              </div>
            </div>

            <div className="flex items-center p-1 rounded-xl bg-[var(--bg-pill)] border border-[var(--border-subtle)] space-x-1">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
                className={`p-1.5 rounded-lg text-xs flex items-center space-x-1.5 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[var(--bg-card-solid)] text-[var(--text-main)] shadow-sm font-semibold'
                    : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'
                }`}
              >
                <LayoutList className="w-4 h-4" />
                <span className="text-[10px] font-mono uppercase tracking-wider hidden sm:inline">List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
                className={`p-1.5 rounded-lg text-xs flex items-center space-x-1.5 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[var(--bg-card-solid)] text-[var(--text-main)] shadow-sm font-semibold'
                    : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="text-[10px] font-mono uppercase tracking-wider hidden sm:inline">Grid</span>
              </button>
            </div>
          </div>
        </div>


        {renderContent()}

        {totalPages > 1 && flights.length > 0 && !initialLoading && (
          <div className="flex items-center justify-between mt-8 p-4 bg-[var(--bg-pill)] rounded-2xl border border-[var(--border-subtle)] shadow-sm">
            <button
              onClick={() => {
                const newPage = Math.max(0, currentPage - 1);
                setCurrentPage(newPage);
                fetchFlights({ isFirstLoad: false, page: newPage, searchMode: isSearching });
              }}
              disabled={currentPage === 0 || searchLoading}
              className="apple-btn-secondary px-4 py-2 text-xs disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-xs font-semibold font-mono text-[var(--text-sub)]">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => {
                const newPage = Math.min(totalPages - 1, currentPage + 1);
                setCurrentPage(newPage);
                fetchFlights({ isFirstLoad: false, page: newPage, searchMode: isSearching });
              }}
              disabled={currentPage === totalPages - 1 || searchLoading}
              className="apple-btn-secondary px-4 py-2 text-xs disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>

      <FlightDetailsModal
        isOpen={isDetailsOpen}
        flight={selectedFlight}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedFlight(null);
        }}
      />

      <FlightFormModal
        isOpen={isCreateModalOpen}
        initialData={editFlightData}
        isSubmitting={isFormSubmitting}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditFlightData(null);
        }}
        onSubmit={handleFormSubmit}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Remove Flight Schedule"
        message={`Are you sure you want to remove flight ${deleteTarget?.flightNumber} (${deleteTarget?.source} → ${deleteTarget?.destination})? The flight will be soft-deleted and hidden from the dashboard.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
