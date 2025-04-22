package com.example.vanease.VanEase.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "booking")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Integer bookingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "User is required")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    @NotNull(message = "Vehicle is required")
    private Vehicle vehicle;

    @Column(name = "start_date", nullable = false)
    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date must be today or in the future")
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    @NotNull(message = "End date is required")
    @FutureOrPresent(message = "End date must be today or in the future")
    private LocalDate endDate;

    @Column(name = "pickup_location", nullable = false, length = 255)
    @NotBlank(message = "Pickup location is required")
    private String pickupLocation;

    @Column(name = "dropoff_location", nullable = false, length = 255)
    @NotBlank(message = "Drop-off location is required")
    private String dropoffLocation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "total_days")
    private Long totalDays;

    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private Payment payment;

    @PrePersist
    @PreUpdate
    public void calculateBookingDetails() {
        if (startDate != null && endDate != null) {
            this.totalDays = ChronoUnit.DAYS.between(startDate, endDate) + 1;
            if (vehicle != null && vehicle.getRentalRate() != null) {
                this.totalPrice = BigDecimal.valueOf(totalDays)
                        .multiply(vehicle.getRentalRate())
                        .setScale(2, RoundingMode.HALF_UP);
            }
        }
    }

    public void confirm() {
        if (this.status == BookingStatus.PENDING) {
            this.status = BookingStatus.CONFIRMED;
        }
    }

    public void cancel() {
        if (this.status != BookingStatus.CANCELLED && this.status != BookingStatus.COMPLETED) {
            this.status = BookingStatus.CANCELLED;
            if (payment != null) {
                payment.setPaymentStatus(Payment.PaymentStatus.REFUNDED);
            }
        }
    }

    public void complete() {
        if (this.status == BookingStatus.CONFIRMED) {
            this.status = BookingStatus.COMPLETED;
        }
    }

    public boolean isActive() {
        return this.status == BookingStatus.CONFIRMED ||
                this.status == BookingStatus.PENDING;
    }

    public boolean isCancellable() {
        return this.status == BookingStatus.PENDING ||
                this.status == BookingStatus.CONFIRMED;
    }
}