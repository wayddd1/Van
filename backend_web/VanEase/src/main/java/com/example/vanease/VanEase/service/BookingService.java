package com.example.vanease.VanEase.service;

import com.example.vanease.VanEase.dto.BookingRequestDTO;
import com.example.vanease.VanEase.exception.BookingConflictException;
import com.example.vanease.VanEase.exception.ResourceNotFoundException;
import com.example.vanease.VanEase.exception.UnauthorizedAccessException;
import com.example.vanease.VanEase.model.*;
import com.example.vanease.VanEase.repository.BookingRepository;
import com.example.vanease.VanEase.repository.UserRepository;
import com.example.vanease.VanEase.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;

    @Transactional
    public Booking createBooking(BookingRequestDTO bookingRequest, User user) {
        if (bookingRequest.getEndDate().isBefore(bookingRequest.getStartDate())) {
            throw new IllegalArgumentException("End date must be after start date");
        }

        Vehicle vehicle = vehicleRepository.findById(bookingRequest.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + bookingRequest.getVehicleId()));

        if (!isVehicleAvailable(vehicle, bookingRequest.getStartDate(), bookingRequest.getEndDate())) {
            throw new BookingConflictException("Vehicle is not available for the selected dates");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setVehicle(vehicle);
        booking.setStartDate(bookingRequest.getStartDate());
        booking.setEndDate(bookingRequest.getEndDate());
        booking.setPickupLocation(bookingRequest.getPickupLocation());
        booking.setDropoffLocation(bookingRequest.getDropoffLocation());
        booking.setStatus(BookingStatus.PENDING);

        long days = ChronoUnit.DAYS.between(bookingRequest.getStartDate(), bookingRequest.getEndDate()) + 1;
        booking.setTotalDays(days);
        BigDecimal totalPrice = vehicle.getRatePerDay().multiply(BigDecimal.valueOf(days));
        booking.setTotalPrice(totalPrice);

        return bookingRepository.save(booking);
    }

    @Transactional(readOnly = true)
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    public List<Booking> getUserBookings(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return bookingRepository.findByUser(user);
    }

    public List<Booking> getVehicleBookings(Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + vehicleId));
        return bookingRepository.findByVehicle(vehicle);
    }

    @Transactional
    public Booking updateBookingStatus(Long bookingId, BookingStatus status, User requestingUser) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!requestingUser.getRole().equals(Role.MANAGER) &&
                !booking.getUser().getId().equals(requestingUser.getId())) {
            throw new UnauthorizedAccessException("You are not authorized to update this booking");
        }

        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    @Transactional
    public void deleteBooking(Long bookingId, User requestingUser) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!requestingUser.getRole().equals(Role.MANAGER) &&
                !booking.getUser().getId().equals(requestingUser.getId())) {
            throw new UnauthorizedAccessException("You are not authorized to delete this booking");
        }

        bookingRepository.delete(booking);
    }

    public List<Booking> getActiveBookings() {
        return bookingRepository.findActiveBookings();
    }

    public List<Booking> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }

    public List<Booking> getUpcomingUserBookings(User user) {
        return bookingRepository.findUpcomingBookingsByUser(user, LocalDate.now());
    }

    public List<Booking> getPastUserBookings(User user) {
        return bookingRepository.findPastBookingsByUser(user, LocalDate.now());
    }

    public boolean isVehicleAvailable(Vehicle vehicle, LocalDate startDate, LocalDate endDate) {
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(vehicle, startDate, endDate);
        return overlappingBookings.isEmpty();
    }

    public BigDecimal calculateBookingPrice(Long vehicleId, LocalDate startDate, LocalDate endDate) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + vehicleId));
        long days = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        return vehicle.getRatePerDay().multiply(BigDecimal.valueOf(days));
    }
}