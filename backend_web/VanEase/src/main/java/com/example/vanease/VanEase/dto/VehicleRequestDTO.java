package com.example.vanease.VanEase.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class VehicleRequestDTO {
    @NotBlank
    private String plateNumber;

    @NotBlank
    private String brand;

    @NotBlank
    private String model;

    @NotNull
    private Integer year;

    @NotNull
    private BigDecimal ratePerDay;

    @NotNull
    private Integer capacity;

    @NotBlank
    private String fuelType;

    @NotBlank
    private String transmission;

    private Boolean availability = true;

    private String status;

    private String description;

    // Field to control image removal
    private Boolean removeImage = false;
}