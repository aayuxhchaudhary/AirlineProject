package com.airline.repository;

import com.airline.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    boolean existsByFlightNumber(String flightNumber);

    Optional<Flight> findByFlightNumber(String flightNumber);

    Page<Flight> findBySourceIgnoreCaseAndDestinationIgnoreCase(String source, String destination, Pageable pageable);

    Page<Flight> findBySourceIgnoreCaseContaining(String source, Pageable pageable);

    Page<Flight> findByDestinationIgnoreCaseContaining(String destination, Pageable pageable);

    Page<Flight> findBySourceIgnoreCaseContainingAndDestinationIgnoreCaseContaining(String source, String destination, Pageable pageable);
}
