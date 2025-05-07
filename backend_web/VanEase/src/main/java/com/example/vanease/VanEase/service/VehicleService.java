package com.example.vanease.VanEase.service;

import com.example.vanease.VanEase.dto.VehicleRequestDTO;
import com.example.vanease.VanEase.dto.VehiclePictureResponse;
import com.example.vanease.VanEase.model.User;
import com.example.vanease.VanEase.model.Vehicle;
import com.example.vanease.VanEase.repository.VehicleRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.example.vanease.VanEase.model.VehicleStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserService userService; // Inject UserService to get the current user

    public Vehicle addVehicleWithImage(VehicleRequestDTO dto, MultipartFile image) throws IOException {
        User manager = userService.getCurrentUser();

        Vehicle vehicle = Vehicle.builder()
                .plateNumber(dto.getPlateNumber())
                .brand(dto.getBrand())
                .model(dto.getModel())
                .year(dto.getYear())
                .ratePerDay(dto.getRatePerDay())
                .capacity(dto.getCapacity())
                .fuelType(dto.getFuelType())
                .transmission(dto.getTransmission())
                .availability(dto.getAvailability())
                .status(dto.getStatus())
                .description(dto.getDescription())
                .manager(manager)
                .build();

        if (image != null && !image.isEmpty()) {
            if (image.getSize() > 5 * 1024 * 1024) { // 5 MB limit
                throw new IllegalArgumentException("File size exceeds 5MB limit");
            }
            vehicle.setImage(image.getBytes());
            vehicle.setImageContentType(image.getContentType());
            vehicle.setImageSize(image.getSize());
        }

        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, VehicleRequestDTO dto) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));

        vehicle.setPlateNumber(dto.getPlateNumber());
        vehicle.setBrand(dto.getBrand());
        vehicle.setModel(dto.getModel());
        vehicle.setYear(dto.getYear());
        vehicle.setRatePerDay(dto.getRatePerDay());
        vehicle.setCapacity(dto.getCapacity());
        vehicle.setFuelType(dto.getFuelType());
        vehicle.setTransmission(dto.getTransmission());
        vehicle.setAvailability(dto.getAvailability());
        vehicle.setStatus(dto.getStatus());
        vehicle.setDescription(dto.getDescription());

        return vehicleRepository.save(vehicle);
    }

    public void deleteVehicle(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new EntityNotFoundException("Vehicle not found");
        }
        vehicleRepository.deleteById(id);
    }

    public Vehicle getVehicleById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Vehicle ID cannot be null");
        }
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found with ID: " + id));
    }

    public VehiclePictureResponse uploadVehicleImage(Long vehicleId, MultipartFile file) throws IOException {
        if (file.getSize() > 5 * 1024 * 1024) { // 5 MB limit
            throw new IllegalArgumentException("File size exceeds 5MB limit");
        }

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));

        vehicle.setImage(file.getBytes());
        vehicle.setImageContentType(file.getContentType());
        vehicle.setImageSize(file.getSize());

        vehicleRepository.save(vehicle);

        return VehiclePictureResponse.builder()
                .vehicleId(vehicle.getId())
                .fileName(file.getOriginalFilename())
                .message("Vehicle image updated successfully")
                .imageUrl("/api/vehicles/" + vehicle.getId() + "/image")
                .build();
    }

    public void removeVehicleImage(Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));

        vehicle.setImage(null);
        vehicle.setImageContentType(null);
        vehicle.setImageSize(null);

        vehicleRepository.save(vehicle);
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }
    
    public List<Vehicle> getAvailableVehicles() {
        return vehicleRepository.findByStatusAndAvailability(VehicleStatus.AVAILABLE, true);
    }
}
