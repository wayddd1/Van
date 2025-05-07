package com.example.vanease.VanEase.repository;

import com.example.vanease.VanEase.model.Payment;
import com.example.vanease.VanEase.model.PaymentMethod;
import com.example.vanease.VanEase.model.PaymentStatus;
import com.example.vanease.VanEase.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByBooking(Booking booking);
    List<Payment> findByPaymentMethod(PaymentMethod method);
    List<Payment> findByPaymentStatus(PaymentStatus status);
    List<Payment> findByBookingAndPaymentStatus(Booking booking, PaymentStatus status);
    List<Payment> findByBookingAndPaymentMethod(Booking booking, PaymentMethod method);
    List<Payment> findByTransactionId(String transactionId);
}