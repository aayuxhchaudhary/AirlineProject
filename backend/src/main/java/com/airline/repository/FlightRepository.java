package com.airline.repository;

import com.airline.entity.Flight;
import com.airline.entity.enums.FlightStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {
    Page<Flight> findBySourceContainingIgnoreCaseAndDestinationContainingIgnoreCase(String source, String destination, Pageable pageable);
    Page<Flight> findByStatus(FlightStatus status, Pageable pageable);
    Page<Flight> findBySourceContainingIgnoreCaseAndDestinationContainingIgnoreCaseAndStatus(String source, String destination, FlightStatus status, Pageable pageable);
    boolean existsByFlightNumber(String flightNumber);
    boolean existsByFlightNumberAndIdNot(String flightNumber, Long id);

    @Query(value = "SELECT DISTINCT city FROM (" +
                   "  SELECT source AS city FROM flights WHERE is_deleted = 0 " +
                   "  UNION " +
                   "  SELECT destination AS city FROM flights WHERE is_deleted = 0" +
                   ") AS distinct_cities ORDER BY city ASC", nativeQuery = true)
    List<String> findDistinctCities();
}