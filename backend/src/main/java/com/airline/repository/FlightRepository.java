package com.airline.repository;

import com.airline.entity.Flight;
import com.airline.entity.enums.FlightStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {
    Page<Flight> findBySourceContainingIgnoreCaseAndDestinationContainingIgnoreCase(String source, String destination, Pageable pageable);
    Page<Flight> findByStatus(FlightStatus status, Pageable pageable);
    Page<Flight> findBySourceContainingIgnoreCaseAndDestinationContainingIgnoreCaseAndStatus(String source, String destination, FlightStatus status, Pageable pageable);
    boolean existsByFlightNumber(String flightNumber);
}
