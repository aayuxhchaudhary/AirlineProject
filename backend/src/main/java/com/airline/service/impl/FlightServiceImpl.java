package com.airline.service.impl;

import com.airline.entity.Flight;
import com.airline.entity.enums.FlightStatus;
import com.airline.exception.BadRequestException;
import com.airline.exception.ResourceNotFoundException;
import com.airline.repository.FlightRepository;
import com.airline.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
public class FlightServiceImpl implements FlightService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "id", "ticketPrice", "departureTime", "arrivalTime", "airlineName", "flightNumber"
    );

    private final FlightRepository flightRepository;

    @Autowired
    public FlightServiceImpl(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    private Sort buildSort(String sortBy, String direction) {
        String field = ALLOWED_SORT_FIELDS.contains(sortBy) ? sortBy : "id";
        return direction.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(field).ascending()
                : Sort.by(field).descending();
    }

    @Override
    public Page<Flight> getAllFlights(int page, int size, String sortBy, String direction, FlightStatus status) {
        Pageable pageable = PageRequest.of(page, size, buildSort(sortBy, direction));
        if (status != null) {
            return flightRepository.findByStatus(status, pageable);
        }
        return flightRepository.findAll(pageable);
    }

    @Override
    public Flight getFlightById(Long id) {
        return flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with id: " + id));
    }

    @Override
    @Transactional
    public Flight createFlight(Flight flight) {
        if (flightRepository.existsByFlightNumber(flight.getFlightNumber())) {
            throw new BadRequestException("Flight number '" + flight.getFlightNumber() + "' already exists.");
        }
        return flightRepository.save(flight);
    }

    @Override
    @Transactional
    public Flight updateFlight(Long id, Flight flightDetails) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with id: " + id));

        flight.setFlightNumber(flightDetails.getFlightNumber());
        flight.setAirlineName(flightDetails.getAirlineName());
        flight.setSource(flightDetails.getSource());
        flight.setDestination(flightDetails.getDestination());
        flight.setDepartureTime(flightDetails.getDepartureTime());
        flight.setArrivalTime(flightDetails.getArrivalTime());
        flight.setTotalSeats(flightDetails.getTotalSeats());
        flight.setAvailableSeats(flightDetails.getAvailableSeats());
        flight.setTicketPrice(flightDetails.getTicketPrice());
        flight.setStatus(flightDetails.getStatus());

        return flightRepository.save(flight);
    }

    @Override
    @Transactional
    public void deleteFlight(Long id) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with id: " + id));
        flight.setDeleted(true);
        flightRepository.save(flight);
    }

    @Override
    public Page<Flight> searchFlights(String source, String destination, int page, int size, String sortBy, String direction, FlightStatus status) {
        Pageable pageable = PageRequest.of(page, size, buildSort(sortBy, direction));
        if (status != null) {
            return flightRepository.findBySourceContainingIgnoreCaseAndDestinationContainingIgnoreCaseAndStatus(source, destination, status, pageable);
        }
        return flightRepository.findBySourceContainingIgnoreCaseAndDestinationContainingIgnoreCase(source, destination, pageable);
    }
}
