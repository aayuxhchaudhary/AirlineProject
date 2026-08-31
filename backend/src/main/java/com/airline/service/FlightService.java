package com.airline.service;

import com.airline.entity.Flight;
import com.airline.entity.enums.FlightStatus;
import org.springframework.data.domain.Page;

import java.util.List;

public interface FlightService {
    Page<Flight> getAllFlights(int page, int size, String sortBy, String direction, FlightStatus status);
    Flight getFlightById(Long id);
    Flight createFlight(Flight flight);
    Flight updateFlight(Long id, Flight flightDetails);
    void deleteFlight(Long id);
    Page<Flight> searchFlights(String source, String destination, int page, int size, String sortBy, String direction, FlightStatus status);
    List<String> getDistinctCities();
}
