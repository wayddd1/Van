package com.example.vanease.VanEase.service;

import com.example.vanease.VanEase.exception.*;
import com.example.vanease.VanEase.model.*;
import com.example.vanease.VanEase.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    @Autowired
    public BookingService(BookingRepository bookingRepository,
                          VehicleRepository vehicleRepository,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Integer id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    public List<Booking> getBookingsByUserId(Integer userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        return bookingRepository.findByUser_UserId(userId);
    }

    public List<Booking> getActiveBookingsForVehicle(Integer vehicleId, LocalDate startDate, LocalDate endDate) {
        return bookingRepository.findActiveBookingsForVehicle(vehicleId, startDate, endDate);
    }

    @Transactional
    public Booking createBooking(Booking booking) {
        // Validate user exists
        User user = userRepository.findById(booking.getUser().getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Validate vehicle exists and is available
        Vehicle vehicle = vehicleRepository.findById(booking.getVehicle().getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        if (!vehicle.getAvailability()) {
            throw new VehicleNotAvailableException("Vehicle is not available");
        }

        // Check for date conflicts
        if (hasBookingConflict(vehicle.getVehicleId(), booking.getStartDate(), booking.getEndDate())) {
            throw new BookingConflictException("Vehicle already booked for selected dates");
        }

        // Set calculated fields
        booking.calculateBookingDetails();
        booking.setStatus(BookingStatus.PENDING);
        booking.setUser(user);
        booking.setVehicle(vehicle);

        // Make vehicle unavailable
        vehicle.setAvailability(false);
        vehicleRepository.save(vehicle);

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking updateBookingStatus(Integer id, BookingStatus status) {
        Booking booking = getBookingById(id);

        switch (status) {
            case CONFIRMED:
                booking.confirm();
                break;
            case CANCELLED:
                booking.cancel();
                // Make vehicle available again
                booking.getVehicle().setAvailability(true);
                vehicleRepository.save(booking.getVehicle());
                break;
            case COMPLETED:
                booking.complete();
                // Make vehicle available again
                booking.getVehicle().setAvailability(true);
                vehicleRepository.save(booking.getVehicle());
                break;
            default:
                throw new InvalidBookingStatusException("Invalid status update");
        }

        return bookingRepository.save(booking);
    }

    @Transactional
    public void deleteBooking(Integer id) {
        Booking booking = getBookingById(id);

        if (booking.isActive()) {
            booking.getVehicle().setAvailability(true);
            vehicleRepository.save(booking.getVehicle());
        }

        bookingRepository.delete(booking);
    }

    private boolean hasBookingConflict(Integer vehicleId, LocalDate startDate, LocalDate endDate) {
        List<Booking> conflictingBookings = bookingRepository.findActiveBookingsForVehicle(
                vehicleId, startDate, endDate);
        return !conflictingBookings.isEmpty();
    }
}