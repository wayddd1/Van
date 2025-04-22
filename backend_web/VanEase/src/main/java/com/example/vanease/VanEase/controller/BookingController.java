package com.example.vanease.VanEase.controller;

import com.example.vanease.VanEase.model.Booking;
import com.example.vanease.VanEase.model.BookingStatus;
import com.example.vanease.VanEase.model.User;
import com.example.vanease.VanEase.model.Vehicle;
import com.example.vanease.VanEase.service.BookingService;
import com.example.vanease.VanEase.security.service.JwtService;
import com.example.vanease.VanEase.repository.UserRepository;
import com.example.vanease.VanEase.repository.VehicleRepository;
import com.example.vanease.VanEase.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
@Tag(name = "Booking Management", description = "Operations for managing van bookings")
public class BookingController {

    private final BookingService bookingService;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;

    @Autowired
    public BookingController(BookingService bookingService, JwtService jwtService, UserRepository userRepository, VehicleRepository vehicleRepository) {
        this.bookingService = bookingService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Operation(summary = "Get all bookings", description = "Retrieves a list of all bookings")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved bookings")
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @Operation(summary = "Get booking by ID", description = "Retrieves a specific booking by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Booking found"),
            @ApiResponse(responseCode = "404", description = "Booking not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(
            @Parameter(description = "ID of the booking to retrieve")
            @PathVariable Integer id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @Operation(summary = "Get bookings by user ID", description = "Retrieves all bookings for a specific user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Bookings retrieved"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUserId(
            @Parameter(description = "ID of the user")
            @PathVariable Integer userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
    }

    @Operation(summary = "Create new booking", description = "Creates a new van booking")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Booking created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "404", description = "Vehicle or user not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized access")
    })
    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @Valid @RequestBody Booking booking,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(null); // Unauthorized if no valid token is provided
        }

        try {
            String token = authorizationHeader.replace("Bearer ", "");
            Integer userId = jwtService.extractUserId(token);

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
            booking.setUser(user);

            Vehicle vehicle = vehicleRepository.findById(booking.getVehicle().getVehicleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + booking.getVehicle().getVehicleId()));
            booking.setVehicle(vehicle);

            Booking createdBooking = bookingService.createBooking(booking);
            return ResponseEntity.ok(createdBooking);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(null); // Bad request for validation issues
        }
    }

    @Operation(summary = "Update booking status", description = "Updates the status of a booking")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Status updated"),
            @ApiResponse(responseCode = "400", description = "Invalid status"),
            @ApiResponse(responseCode = "404", description = "Booking not found")
    })
    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @Parameter(description = "ID of the booking to update") @PathVariable Integer id,
            @Parameter(description = "New status for the booking") @RequestParam BookingStatus status) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status));
    }

    @Operation(summary = "Delete booking", description = "Deletes a booking by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Booking deleted"),
            @ApiResponse(responseCode = "404", description = "Booking not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(
            @Parameter(description = "ID of the booking to delete")
            @PathVariable Integer id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}