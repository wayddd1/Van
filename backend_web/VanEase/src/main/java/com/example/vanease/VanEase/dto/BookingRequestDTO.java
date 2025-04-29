package com.example.vanease.VanEase.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingRequestDTO {

    @NotNull
    private Long vehicleId; // Changed from Integer to Long

    @NotNull
    @Future
    private LocalDate startDate;

    @NotNull
    @Future
    private LocalDate endDate;

    @NotNull
    private String pickupLocation;

    @NotNull
    private String dropoffLocation;
}