package com.airline.service.impl;

import com.airline.entity.Flight;
import com.airline.entity.enums.FlightStatus;
import com.airline.exception.BadRequestException;
import com.airline.exception.ResourceNotFoundException;
import com.airline.repository.FlightRepository;
import com.airline.service.FlightService;
import com.airline.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
public class FlightServiceImpl implements FlightService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "id", "ticketPrice", "departureTime", "arrivalTime", "airlineName", "flightNumber"
    );

    private final FlightRepository flightRepository;
    private final MessageService msg;

    @Autowired
    public FlightServiceImpl(FlightRepository flightRepository, MessageService messageService) {
        this.flightRepository = flightRepository;
        this.msg = messageService;
    }

    private Sort buildSort(String sortBy, String direction) {
        String field = ALLOWED_SORT_FIELDS.contains(sortBy) ? sortBy : "id";
        return direction.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(field).ascending()
                : Sort.by(field).descending();
    }

    private void validateFlight(Flight flight, boolean isNew) {
        if (flight.getSource() != null && flight.getDestination() != null &&
            flight.getSource().trim().equalsIgnoreCase(flight.getDestination().trim())) {
            throw new BadRequestException(msg.get("app.messages.flight.identical-cities"));
        }
        if (flight.getDepartureTime() != null && flight.getArrivalTime() != null) {
            if (!flight.getArrivalTime().isAfter(flight.getDepartureTime())) {
                throw new BadRequestException(msg.get("app.messages.flight.invalid-arrival"));
            }
            if (isNew && flight.getDepartureTime().isBefore(LocalDateTime.now().minusMinutes(5))) {
                throw new BadRequestException(msg.get("app.messages.flight.past-departure"));
            }
        }
        if (flight.getTotalSeats() != null && flight.getAvailableSeats() != null) {
            if (flight.getAvailableSeats() > flight.getTotalSeats()) {
                throw new BadRequestException(msg.get("app.messages.flight.excess-seats"));
            }
            if (flight.getAvailableSeats() < 0) {
                throw new BadRequestException(msg.get("app.messages.flight.negative-seats"));
            }
        }
        if (flight.getTicketPrice() != null && flight.getTicketPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException(msg.get("app.messages.flight.invalid-price"));
        }
    }

    @Override
    public Page<Flight> getAllFlights(int page, int size, String sortBy, String direction, FlightStatus status) {
        if (page < 0) throw new BadRequestException(msg.get("app.messages.flight.invalid-page"));
        if (size <= 0 || size > 100) throw new BadRequestException(msg.get("app.messages.flight.invalid-size"));
        Pageable pageable = PageRequest.of(page, size, buildSort(sortBy, direction));
        return flightRepository.findAllWithFilters(status, pageable);
    }

    @Override
    public Flight getFlightById(Long id) {
        if (id == null || id <= 0) throw new BadRequestException(msg.get("app.messages.flight.invalid-id"));
        return flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(msg.get("app.messages.flight.not-found", id)));
    }

    @Override
    @Transactional
    public Flight createFlight(Flight flight) {
        validateFlight(flight, true);
        if (flightRepository.existsByFlightNumber(flight.getFlightNumber())) {
            throw new BadRequestException(msg.get("app.messages.flight.duplicate-number", flight.getFlightNumber()));
        }
        return flightRepository.save(flight);
    }

    @Override
    @Transactional
    public Flight updateFlight(Long id, Flight flightDetails) {
        if (id == null || id <= 0) throw new BadRequestException(msg.get("app.messages.flight.invalid-id"));
        validateFlight(flightDetails, false);
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(msg.get("app.messages.flight.not-found", id)));

        if (flightRepository.existsByFlightNumberAndIdNot(flightDetails.getFlightNumber(), id)) {
            throw new BadRequestException(msg.get("app.messages.flight.number-in-use", flightDetails.getFlightNumber()));
        }

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
        if (id == null || id <= 0) throw new BadRequestException(msg.get("app.messages.flight.invalid-id"));
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(msg.get("app.messages.flight.not-found", id)));
        flight.setDeleted(true);
        flightRepository.save(flight);
    }

    @Override
    public Page<Flight> searchFlights(String source, String destination, int page, int size, String sortBy, String direction, FlightStatus status) {
        if (page < 0) throw new BadRequestException(msg.get("app.messages.flight.invalid-page"));
        if (size <= 0 || size > 100) throw new BadRequestException(msg.get("app.messages.flight.invalid-size"));
        Pageable pageable = PageRequest.of(page, size, buildSort(sortBy, direction));
        return flightRepository.searchWithFilters(source, destination, status, pageable);
    }

    @Override
    public List<String> getDistinctCities() {
        return flightRepository.findDistinctCities();
    }
}
