package com.example.vanease.VanEase.controller;

import com.example.vanease.VanEase.dto.VehicleRequestDTO;
import com.example.vanease.VanEase.dto.VehiclePictureResponse;
import com.example.vanease.VanEase.model.Vehicle;
import com.example.vanease.VanEase.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.vanease.VanEase.model.VehicleFuelType;
import com.example.vanease.VanEase.model.VehicleTransmissionType;
import com.example.vanease.VanEase.model.VehicleStatus;


import java.io.IOException;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MANAGER')")
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping
    public ResponseEntity<Vehicle> addVehicle(
            @RequestParam("plateNumber") String plateNumber,
            @RequestParam("brand") String brand,
            @RequestParam("model") String model,
            @RequestParam("year") Integer year,
            @RequestParam("ratePerDay") String ratePerDay,
            @RequestParam("capacity") Integer capacity,
            @RequestParam("fuelType") String fuelType, // String input for enum
            @RequestParam("transmission") String transmission, // String input for enum
            @RequestParam("availability") Boolean availability,
            @RequestParam("status") String status, // String input for enum
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {

        // Convert String values to their respective enums
        VehicleFuelType fuelTypeEnum = VehicleFuelType.valueOf(fuelType.toUpperCase());
        VehicleTransmissionType transmissionEnum = VehicleTransmissionType.valueOf(transmission.toUpperCase());
        VehicleStatus statusEnum = VehicleStatus.valueOf(status.toUpperCase());

        VehicleRequestDTO dto = VehicleRequestDTO.builder()
                .plateNumber(plateNumber)
                .brand(brand)
                .model(model)
                .year(year)
                .ratePerDay(new BigDecimal(ratePerDay))
                .capacity(capacity)
                .fuelType(fuelTypeEnum) // Use the enum
                .transmission(transmissionEnum) // Use the enum
                .availability(availability)
                .status(statusEnum) // Use the enum
                .description(description)
                .build();

        Vehicle createdVehicle = vehicleService.addVehicleWithImage(dto, image);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdVehicle);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long id, @RequestBody VehicleRequestDTO dto) {
        Vehicle updatedVehicle = vehicleService.updateVehicle(id, dto);
        return ResponseEntity.ok(updatedVehicle);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<VehiclePictureResponse> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {
        VehiclePictureResponse response = vehicleService.uploadVehicleImage(id, file);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}/image")
    public ResponseEntity<Void> removeImage(@PathVariable Long id) {
        vehicleService.removeVehicleImage(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getVehicleImage(@PathVariable Long id) {
        Vehicle vehicle = vehicleService.getVehicleById(id);

        if (vehicle.getImage() == null) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(vehicle.getImageContentType()));
        headers.setContentLength(vehicle.getImageSize());
        headers.set("Content-Disposition", "inline; filename=\"vehicle-image-" + vehicle.getId() + "\"");

        return new ResponseEntity<>(vehicle.getImage(), headers, HttpStatus.OK);
    }
}
