package com.example.vanease.VanEase.service;

import com.example.vanease.VanEase.dto.PaymentRequestDTO;
import com.example.vanease.VanEase.model.*;
import com.example.vanease.VanEase.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final PayPalService payPalService;

    @Transactional
    public Payment createPayment(PaymentRequestDTO dto, User user) {
        Booking booking = bookingRepository.findById(dto.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Verify booking belongs to user
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Booking does not belong to this user");
        }

        PaymentStatus status = PaymentStatus.PENDING;

        // Payment method-specific logic
        switch (dto.getPaymentMethod()) {
            case CASH_ON_HAND:
                // Cash is always pending until admin/driver confirms
                status = PaymentStatus.PENDING;
                break;
            case GCASH:
                // GCash is pending until admin verifies proof
                if (dto.getProofUrl() == null || dto.getProofUrl().isEmpty()) {
                    throw new RuntimeException("Proof of payment is required for GCash");
                }
                status = PaymentStatus.PENDING;
                break;
            case PAYPAL:
                // Verify PayPal payment with PayPal API
                if (dto.getTransactionId() != null && !dto.getTransactionId().isEmpty()) {
                    boolean verified = payPalService.verifyPayment(dto.getTransactionId());
                    status = verified ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;
                    log.info("PayPal payment verification: {} for transaction {}",
                            verified ? "SUCCESS" : "FAILED", dto.getTransactionId());
                } else {
                    status = PaymentStatus.FAILED;
                    log.warn("PayPal payment failed - missing transaction ID");
                }
                break;
            default:
                throw new IllegalArgumentException("Unsupported payment method");
        }

        Payment payment = Payment.builder()
                .booking(booking)
                .amount(dto.getAmount())
                .paymentMethod(dto.getPaymentMethod())
                .paymentStatus(status)
                .transactionId(dto.getTransactionId())
                .proofUrl(dto.getProofUrl())
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        // Update booking status if payment is successful
        if (status == PaymentStatus.SUCCESS) {
            booking.setStatus(BookingStatus.CONFIRMED);
            bookingRepository.save(booking);
        }

        return savedPayment;
    }

    public List<Payment> getPaymentsByBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return paymentRepository.findByBooking(booking);
    }

    public List<Payment> getPaymentsByMethod(PaymentMethod method) {
        return paymentRepository.findByPaymentMethod(method);
    }

    public List<Payment> getPaymentsByStatus(PaymentStatus status) {
        return paymentRepository.findByPaymentStatus(status);
    }

    @Transactional
    public Payment updatePaymentStatus(Long paymentId, PaymentStatus status) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setPaymentStatus(status);

        // Update booking status if payment is successful
        if (status == PaymentStatus.SUCCESS) {
            Booking booking = payment.getBooking();
            booking.setStatus(BookingStatus.CONFIRMED);
            bookingRepository.save(booking);
        }

        return paymentRepository.save(payment);
    }
}