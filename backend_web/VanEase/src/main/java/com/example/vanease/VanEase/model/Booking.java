package com.example.vanease.VanEase.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long bookingId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @NotNull
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @NotBlank
    @Column(name = "pickup_location", nullable = false)
    private String pickupLocation;

    @NotBlank
    @Column(name = "dropoff_location", nullable = false)
    private String dropoffLocation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
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
            if (vehicle != null) {
                this.totalPrice = calculateTotalPrice();
            }
        }
    }

    public BigDecimal calculateTotalPrice() {
        if (vehicle != null && vehicle.getRatePerDay() != null) {
            return vehicle.getRatePerDay().multiply(BigDecimal.valueOf(ChronoUnit.DAYS.between(startDate, endDate) + 1));
        }
        return BigDecimal.ZERO;
    }
}