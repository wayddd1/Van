package com.example.vanease.VanEase.dto;

import com.example.vanease.VanEase.model.VehicleFuelType;
import com.example.vanease.VanEase.model.VehicleTransmissionType;
import com.example.vanease.VanEase.model.VehicleStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class VehicleRequestDTO {
    private String plateNumber;
    private String brand;
    private String model;
    private Integer year;
    private BigDecimal ratePerDay;
    private Integer capacity;
    private VehicleFuelType fuelType;
    private VehicleTransmissionType transmission;
    private Boolean availability;
    private VehicleStatus status;
    private String description;
}
