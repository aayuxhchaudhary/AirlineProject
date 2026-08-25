package com.airline.repository;

import com.airline.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    boolean existsByFlightNumber(String flightNumber);

    Optional<Flight> findByFlightNumber(String flightNumber);

    List<Flight> findBySourceIgnoreCaseAndDestinationIgnoreCase(String source, String destination);

    List<Flight> findBySourceIgnoreCaseContaining(String source);

    List<Flight> findByDestinationIgnoreCaseContaining(String destination);

    List<Flight> findBySourceIgnoreCaseContainingAndDestinationIgnoreCaseContaining(String source, String destination);
}
