package com.example.vanease.VanEase.controller;

import com.example.vanease.VanEase.dto.BookingRequestDTO;
import com.example.vanease.VanEase.model.Booking;
import com.example.vanease.VanEase.model.BookingStatus;
import com.example.vanease.VanEase.model.User;
import com.example.vanease.VanEase.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Endpoints for booking operations")
public class BookingController {

    private final BookingService bookingService;

    @Operation(summary = "Create a booking")
    @PostMapping
    public Booking createBooking(@RequestBody BookingRequestDTO bookingRequest, @RequestAttribute User user) {
        return bookingService.createBooking(bookingRequest, user);
    }

    @Operation(summary = "Get all bookings")
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @Operation(summary = "Get booking by ID")
    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id);
    }

    @Operation(summary = "Get bookings by user ID")
    @GetMapping("/user/{userId}")
    public List<Booking> getUserBookings(@PathVariable Long userId) {
        return bookingService.getUserBookings(userId);
    }

    @Operation(summary = "Get bookings by vehicle ID")
    @GetMapping("/vehicle/{vehicleId}")
    public List<Booking> getVehicleBookings(@PathVariable Long vehicleId) {
        return bookingService.getVehicleBookings(vehicleId);
    }

    @Operation(summary = "Update booking status")
    @PatchMapping("/{bookingId}/status")
    public Booking updateBookingStatus(@PathVariable Long bookingId, @RequestParam BookingStatus status, @RequestAttribute User user) {
        return bookingService.updateBookingStatus(bookingId, status, user);
    }

    @Operation(summary = "Delete booking")
    @DeleteMapping("/{bookingId}")
    public void deleteBooking(@PathVariable Long bookingId, @RequestAttribute User user) {
        bookingService.deleteBooking(bookingId, user);
    }

    @Operation(summary = "Get active bookings")
    @GetMapping("/active")
    public List<Booking> getActiveBookings() {
        return bookingService.getActiveBookings();
    }

    @Operation(summary = "Get bookings by status")
    @GetMapping("/status/{status}")
    public List<Booking> getBookingsByStatus(@PathVariable BookingStatus status) {
        return bookingService.getBookingsByStatus(status);
    }

    @Operation(summary = "Get upcoming bookings for user")
    @GetMapping("/user/upcoming")
    public List<Booking> getUpcomingUserBookings(@RequestAttribute User user) {
        return bookingService.getUpcomingUserBookings(user);
    }

    @Operation(summary = "Get past bookings for user")
    @GetMapping("/user/past")
    public List<Booking> getPastUserBookings(@RequestAttribute User user) {
        return bookingService.getPastUserBookings(user);
    }
}