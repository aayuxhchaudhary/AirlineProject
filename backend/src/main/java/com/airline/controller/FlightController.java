package com.airline.controller;

import com.airline.entity.Flight;
import com.airline.entity.enums.FlightStatus;
import com.airline.service.FlightService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping
    public ResponseEntity<Page<Flight>> getAllFlights(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) FlightStatus status) {
        return ResponseEntity.ok(flightService.getAllFlights(page, size, sortBy, direction, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Flight> getFlightById(@PathVariable Long id) {
        return ResponseEntity.ok(flightService.getFlightById(id));
    }

    @PostMapping
    public ResponseEntity<Flight> createFlight(@Valid @RequestBody Flight flight) {
        return ResponseEntity.status(201).body(flightService.createFlight(flight));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Flight> updateFlight(@PathVariable Long id, @Valid @RequestBody Flight flightDetails) {
        return ResponseEntity.ok(flightService.updateFlight(id, flightDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteFlight(@PathVariable Long id) {
        flightService.deleteFlight(id);
        return ResponseEntity.ok(Map.of("deleted", Boolean.TRUE));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Flight>> searchFlights(
            @RequestParam(required = false, defaultValue = "") String source,
            @RequestParam(required = false, defaultValue = "") String destination,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) FlightStatus status) {
        return ResponseEntity.ok(flightService.searchFlights(source, destination, page, size, sortBy, direction, status));
    }
}
