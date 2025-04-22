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
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository,
                          BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Payment getPaymentById(Integer id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
    }

    public Payment getPaymentByBookingId(Integer bookingId) {
        return paymentRepository.findByBooking_BookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payment not found for booking id: " + bookingId));
    }

    @Transactional
    public Payment processPayment(Payment payment) {
        // Validate booking exists
        Booking booking = bookingRepository.findById(payment.getBooking().getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + payment.getBooking().getBookingId()));

        // Validate payment amount
        if (payment.getAmount() == null || payment.getAmount() <= 0) {
            throw new InvalidPaymentException("Payment amount must be positive");
        }

        // Check for existing payment
        if (paymentRepository.existsByBooking_BookingId(booking.getBookingId())) {
            throw new PaymentExistsException(
                    "Payment already exists for booking id: " + booking.getBookingId());
        }

        // Validate booking status
        if (!booking.isActive()) {
            throw new InvalidBookingStateException(
                    "Cannot process payment for inactive booking");
        }

        // Process payment
        payment.setBooking(booking);
        if (payment.processPayment()) {
            booking.confirm();
            bookingRepository.save(booking);
            return paymentRepository.save(payment);
        } else {
            throw new PaymentProcessingException("Payment processing failed");
        }
    }

    @Transactional
    public Payment refundPayment(Integer paymentId) {
        Payment payment = getPaymentById(paymentId);

        if (payment.getPaymentStatus() != Payment.PaymentStatus.COMPLETED) {
            throw new InvalidPaymentStateException(
                    "Only completed payments can be refunded");
        }

        // Simulate refund processing
        payment.setPaymentStatus(Payment.PaymentStatus.REFUNDED);
        payment.getBooking().cancel();
        bookingRepository.save(payment.getBooking());

        return paymentRepository.save(payment);
    }

    @Transactional
    public void deletePayment(Integer id) {
        Payment payment = getPaymentById(id);
        payment.getBooking().cancel();
        bookingRepository.save(payment.getBooking());
        paymentRepository.delete(payment);
    }
}