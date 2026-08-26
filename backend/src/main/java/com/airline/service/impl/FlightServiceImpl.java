package com.airline.service.impl;

import com.airline.entity.Flight;
import com.airline.exception.BadRequestException;
import com.airline.exception.ResourceNotFoundException;
import com.airline.repository.FlightRepository;
import com.airline.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FlightServiceImpl implements FlightService {

    private final FlightRepository flightRepository;

    @Autowired
    public FlightServiceImpl(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    private void validateFlightData(Flight flight) {
        if (flight.getDepartureTime() != null && flight.getDepartureTime().isBefore(LocalDateTime.now().minusMinutes(1))) {
            throw new BadRequestException("Departure time cannot be in the past.");
        }
        if (flight.getArrivalTime() != null && flight.getDepartureTime() != null && !flight.getArrivalTime().isAfter(flight.getDepartureTime())) {
            throw new BadRequestException("Arrival time must be after departure time.");
        }
        if (flight.getAvailableSeats() != null && flight.getTotalSeats() != null && flight.getAvailableSeats() > flight.getTotalSeats()) {
            throw new BadRequestException("Available seats (" + flight.getAvailableSeats() + ") cannot exceed total capacity (" + flight.getTotalSeats() + ").");
        }
    }

    @Override
    @Transactional
    public Flight createFlight(Flight flight) {
        if (flightRepository.existsByFlightNumber(flight.getFlightNumber())) {
            throw new BadRequestException("Flight with flight number " + flight.getFlightNumber() + " already exists.");
        }
        validateFlightData(flight);
        return flightRepository.save(flight);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    @Override
    public Flight getFlightById(Long id) {
        return flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with ID: " + id));
    }

    @Override
    @Transactional
    public Flight updateFlight(Long id, Flight flightDetails) {
        Flight flight = getFlightById(id);

        Optional<Flight> existing = flightRepository.findByFlightNumber(flightDetails.getFlightNumber());
        if (existing.isPresent() && !existing.get().getId().equals(id)) {
            throw new BadRequestException("Flight number " + flightDetails.getFlightNumber() + " belongs to another flight.");
        }

        validateFlightData(flightDetails);

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
        Flight flight = getFlightById(id);
        flightRepository.delete(flight);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Flight> searchFlights(String source, String destination) {
        boolean hasSource = source != null && !source.trim().isEmpty();
        boolean hasDest = destination != null && !destination.trim().isEmpty();

        if (hasSource && hasDest) {
            return flightRepository.findBySourceIgnoreCaseContainingAndDestinationIgnoreCaseContaining(source.trim(), destination.trim());
        } else if (hasSource) {
            return flightRepository.findBySourceIgnoreCaseContaining(source.trim());
        } else if (hasDest) {
            return flightRepository.findByDestinationIgnoreCaseContaining(destination.trim());
        } else {
            return flightRepository.findAll();
        }
    }

    @Override
    public String getFlightStatus(Long id) {
        Flight flight = getFlightById(id);
        return flight.getStatus();
    }
}
