package com.airline.repository;

import com.airline.entity.Flight;
import com.airline.entity.enums.FlightStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    @Query("SELECT f FROM Flight f WHERE " +
           "(:status IS NULL OR f.status = :status)")
    Page<Flight> findAllWithFilters(@Param("status") FlightStatus status, Pageable pageable);

    @Query("SELECT f FROM Flight f WHERE " +
           "(:source IS NULL OR :source = '' OR LOWER(f.source) LIKE LOWER(CONCAT('%', :source, '%'))) AND " +
           "(:destination IS NULL OR :destination = '' OR LOWER(f.destination) LIKE LOWER(CONCAT('%', :destination, '%'))) AND " +
           "(:status IS NULL OR f.status = :status)")
    Page<Flight> searchWithFilters(@Param("source") String source,
                                   @Param("destination") String destination,
                                   @Param("status") FlightStatus status,
                                   Pageable pageable);

    boolean existsByFlightNumber(String flightNumber);
    boolean existsByFlightNumberAndIdNot(String flightNumber, Long id);

    @Query(value = "SELECT DISTINCT city FROM (" +
                   "  SELECT source AS city FROM flights WHERE is_deleted = 0 " +
                   "  UNION " +
                   "  SELECT destination AS city FROM flights WHERE is_deleted = 0" +
                   ") AS distinct_cities ORDER BY city ASC", nativeQuery = true)
    List<String> findDistinctCities();
}