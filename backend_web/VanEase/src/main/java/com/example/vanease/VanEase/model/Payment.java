package com.example.vanease.VanEase.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "payment")
public class Payment {

    public enum PaymentMethod {
        CREDIT_CARD, DEBIT_CARD, BANK_TRANSFER, PAYPAL, CASH_ON_SITE
    }

    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED, REFUNDED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Integer paymentId;

    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false)
    @NotNull(message = "Booking is required")
    private Booking booking;

    @Column(nullable = false)
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be at least 0.01")
    private Float amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "transaction_id")
    private String transactionId;

    public boolean processPayment() {
        if (this.amount == null || this.amount <= 0 || this.paymentMethod == null) {
            this.paymentStatus = PaymentStatus.FAILED;
            return false;
        }

        // Simulate payment processing - replace with actual payment gateway integration
        try {
            boolean paymentSuccess = simulatePaymentGateway();

            if (paymentSuccess) {
                this.paymentStatus = PaymentStatus.COMPLETED;
                this.paymentDate = LocalDate.now();
                this.transactionId = "TXN" + System.currentTimeMillis();
                return true;
            }
        } catch (Exception e) {
            this.paymentStatus = PaymentStatus.FAILED;
        }
        return false;
    }

    private boolean simulatePaymentGateway() {
        // Simulate 85% success rate for demo purposes
        return Math.random() > 0.15;
    }

    public String verifyPaymentStatus() {
        return this.paymentStatus.toString();
    }
}