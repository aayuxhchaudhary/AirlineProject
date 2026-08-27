package com.airline.entity;

import com.airline.entity.enums.FlightStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "flights", indexes = {
    @Index(name = "idx_flight_ticket_price", columnList = "ticket_price"),
    @Index(name = "idx_flight_departure_time", columnList = "departure_time")
})
@SQLDelete(sql = "UPDATE flights SET is_deleted = true WHERE id=?")
@SQLRestriction("is_deleted = false")
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Flight number is required")
    @Size(max = 50, message = "Flight number cannot exceed 50 characters")
    @Column(name = "flight_number", nullable = false, unique = true, length = 50)
    private String flightNumber;

    @NotBlank(message = "Airline name is required")
    @Size(max = 100, message = "Airline name cannot exceed 100 characters")
    @Column(name = "airline_name", nullable = false, length = 100)
    private String airlineName;

    @NotBlank(message = "Source is required")
    @Size(max = 100, message = "Source cannot exceed 100 characters")
    @Column(nullable = false, length = 100)
    private String source;

    @NotBlank(message = "Destination is required")
    @Size(max = 100, message = "Destination cannot exceed 100 characters")
    @Column(nullable = false, length = 100)
    private String destination;

    @NotNull(message = "Departure time is required")
    @Column(name = "departure_time", nullable = false)
    private LocalDateTime departureTime;

    @NotNull(message = "Arrival time is required")
    @Column(name = "arrival_time", nullable = false)
    private LocalDateTime arrivalTime;

    @NotNull(message = "Total seats is required")
    @Min(value = 1, message = "Total seats must be at least 1")
    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats;

    @NotNull(message = "Available seats is required")
    @Min(value = 0, message = "Available seats cannot be negative")
    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats;

    @NotNull(message = "Ticket price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Ticket price must be strictly greater than 0")
    @Column(name = "ticket_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal ticketPrice;

    @NotNull(message = "Flight status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private FlightStatus status;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;

    public Flight() {
    }

    public Flight(Long id, String flightNumber, String airlineName, String source, String destination, LocalDateTime departureTime, LocalDateTime arrivalTime, Integer totalSeats, Integer availableSeats, BigDecimal ticketPrice, FlightStatus status) {
        this.id = id;
        this.flightNumber = flightNumber;
        this.airlineName = airlineName;
        this.source = source;
        this.destination = destination;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.totalSeats = totalSeats;
        this.availableSeats = availableSeats;
        this.ticketPrice = ticketPrice;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public String getAirlineName() {
        return airlineName;
    }

    public void setAirlineName(String airlineName) {
        this.airlineName = airlineName;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public LocalDateTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalDateTime departureTime) {
        this.departureTime = departureTime;
    }

    public LocalDateTime getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(LocalDateTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    public BigDecimal getTicketPrice() {
        return ticketPrice;
    }

    public void setTicketPrice(BigDecimal ticketPrice) {
        this.ticketPrice = ticketPrice;
    }

    public FlightStatus getStatus() {
        return status;
    }

    public void setStatus(FlightStatus status) {
        this.status = status;
    }

    @JsonIgnore
    public boolean isDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean deleted) {
        isDeleted = deleted;
    }
}
