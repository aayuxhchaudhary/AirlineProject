package com.airline.service;

import com.airline.entity.Flight;

import java.util.List;

public interface FlightService {

    Flight createFlight(Flight flight);

    List<Flight> getAllFlights();

    Flight getFlightById(Long id);

    Flight updateFlight(Long id, Flight flightDetails);

    void deleteFlight(Long id);

    List<Flight> searchFlights(String source, String destination);

    String getFlightStatus(Long id);
}
