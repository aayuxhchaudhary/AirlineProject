package com.airline.service;

import com.airline.entity.Flight;

import org.springframework.data.domain.Page;

public interface FlightService {

    Flight createFlight(Flight flight);

    Page<Flight> getAllFlights(int page, int size, String sortBy, String direction);

    Flight getFlightById(Long id);

    Flight updateFlight(Long id, Flight flightDetails);

    void deleteFlight(Long id);

    Page<Flight> searchFlights(String source, String destination, int page, int size, String sortBy, String direction);

    String getFlightStatus(Long id);
}
