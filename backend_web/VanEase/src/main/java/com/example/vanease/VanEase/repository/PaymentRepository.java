package com.example.vanease.VanEase.repository;

import com.example.vanease.VanEase.model.Payment;
import com.example.vanease.VanEase.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByBooking(Booking booking);
}