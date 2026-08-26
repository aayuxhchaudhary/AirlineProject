package com.airline.controller;

import com.airline.dto.ApiResponse;
import com.airline.entity.Flight;
import com.airline.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import java.util.Map;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "*")
public class FlightController {

    private final FlightService flightService;

    @Autowired
    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createFlight(@RequestBody Flight flight) {
        Flight createdFlight = flightService.createFlight(flight);
        ApiResponse response = new ApiResponse(true, "Flight created successfully", createdFlight);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<Flight>> getAllFlights(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Page<Flight> flights = flightService.getAllFlights(page, size, sortBy, direction);
        return ResponseEntity.ok(flights);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Flight> getFlightById(@PathVariable Long id) {
        Flight flight = flightService.getFlightById(id);
        return ResponseEntity.ok(flight);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateFlight(@PathVariable Long id, @RequestBody Flight flightDetails) {
        Flight updatedFlight = flightService.updateFlight(id, flightDetails);
        ApiResponse response = new ApiResponse(true, "Flight updated successfully", updatedFlight);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteFlight(@PathVariable Long id) {
        flightService.deleteFlight(id);
        ApiResponse response = new ApiResponse(true, "Flight deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Flight>> searchFlights(
            @RequestParam(required = false, defaultValue = "") String source,
            @RequestParam(required = false, defaultValue = "") String destination,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Page<Flight> flights = flightService.searchFlights(source, destination, page, size, sortBy, direction);
        return ResponseEntity.ok(flights);
    }

    @GetMapping("/status/{id}")
    public ResponseEntity<Map<String, String>> getFlightStatus(@PathVariable Long id) {
        String status = flightService.getFlightStatus(id);
        return ResponseEntity.ok(Map.of("status", status));
    }
}
