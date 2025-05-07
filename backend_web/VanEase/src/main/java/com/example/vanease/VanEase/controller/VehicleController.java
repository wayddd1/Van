package com.example.vanease.VanEase.controller;

import com.example.vanease.VanEase.dto.VehicleRequestDTO;
import com.example.vanease.VanEase.dto.VehiclePictureResponse;
import com.example.vanease.VanEase.model.*;
import com.example.vanease.VanEase.service.VehicleService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addVehicle(
            @RequestParam String plateNumber,
            @RequestParam String brand,
            @RequestParam String model,
            @RequestParam Integer year,
            @RequestParam String ratePerDay,
            @RequestParam Integer capacity,
            @RequestParam String fuelType,
            @RequestParam String transmission,
            @RequestParam Boolean availability,
            @RequestParam String status,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile image
    ) throws IOException {
        try {
            VehicleFuelType fuelTypeEnum = VehicleFuelType.valueOf(fuelType.toUpperCase());
            VehicleTransmissionType transmissionEnum = VehicleTransmissionType.valueOf(transmission.toUpperCase());
            VehicleStatus statusEnum = VehicleStatus.valueOf(status.toUpperCase());
            BigDecimal rate = new BigDecimal(ratePerDay);

            VehicleRequestDTO dto = VehicleRequestDTO.builder()
                    .plateNumber(plateNumber)
                    .brand(brand)
                    .model(model)
                    .year(year)
                    .ratePerDay(rate)
                    .capacity(capacity)
                    .fuelType(fuelTypeEnum)
                    .transmission(transmissionEnum)
                    .availability(availability)
                    .status(statusEnum)
                    .description(description)
                    .build();

            Vehicle created = vehicleService.addVehicleWithImage(dto, image);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);

        } catch (IllegalArgumentException e) {
            return buildErrorResponse("Invalid value for fuelType, transmission, status, or ratePerDay.", HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(
            @PathVariable Long id,
            @Valid @RequestBody VehicleRequestDTO dto
    ) {
        Vehicle updated = vehicleService.updateVehicle(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<VehiclePictureResponse> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        VehiclePictureResponse response = vehicleService.uploadVehicleImage(id, file);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}/image")
    public ResponseEntity<Void> removeImage(@PathVariable Long id) {
        vehicleService.removeVehicleImage(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/image")
    @CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowedHeaders = "*")
    public ResponseEntity<byte[]> getVehicleImage(@PathVariable Long id) {
        Vehicle vehicle = vehicleService.getVehicleById(id);
        if (vehicle.getImage() == null) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(vehicle.getImageContentType()));
        headers.setContentLength(vehicle.getImageSize());
        headers.setContentDisposition(ContentDisposition.inline().filename("vehicle-image-" + id).build());
        headers.add("Access-Control-Allow-Origin", "http://localhost:3000");
        headers.add("Access-Control-Allow-Methods", "GET, OPTIONS");
        headers.add("Access-Control-Allow-Headers", "Content-Type, Accept");

        return new ResponseEntity<>(vehicle.getImage(), headers, HttpStatus.OK);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        List<Vehicle> vehicles = vehicleService.getAllVehicles();
        return ResponseEntity.ok(vehicles);
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<Vehicle>> getAvailableVehicles() {
        List<Vehicle> vehicles = vehicleService.getAvailableVehicles();
        return ResponseEntity.ok(vehicles);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getVehicleById(@PathVariable Long id) {
        try {
            Vehicle vehicle = vehicleService.getVehicleById(id);
            return ResponseEntity.ok(vehicle);
        } catch (EntityNotFoundException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return buildErrorResponse("Error retrieving vehicle: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Helper: error response formatter
    private ResponseEntity<Map<String, String>> buildErrorResponse(String message, HttpStatus status) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return ResponseEntity.status(status).body(error);
    }
}
