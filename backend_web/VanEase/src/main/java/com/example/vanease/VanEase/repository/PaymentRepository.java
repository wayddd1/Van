package com.example.vanease.VanEase.repository;

import com.example.vanease.VanEase.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    // Add this method
    boolean existsByBooking_BookingId(Integer bookingId);

    // Your other repository methods...
    Optional<Payment> findByBooking_BookingId(Integer bookingId);
}