package com.example.vanease.VanEase.service;

import com.example.vanease.VanEase.dto.VehiclePictureResponse;
import com.example.vanease.VanEase.dto.VehicleRequestDTO;
import com.example.vanease.VanEase.exception.DuplicateResourceException;
import com.example.vanease.VanEase.exception.ResourceNotFoundException;
import com.example.vanease.VanEase.model.User;
import com.example.vanease.VanEase.model.Vehicle;
import com.example.vanease.VanEase.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {
    private final VehicleRepository vehicleRepository;
    private static final long MAX_IMAGE_SIZE = 5_000_000; // 5MB
    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "image/jpeg",
            "image/png",
            "image/gif"
    );

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public List<Vehicle> getAvailableVehicles() {
        return vehicleRepository.findByAvailabilityTrue();
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
    }

    public Vehicle addVehicle(VehicleRequestDTO vehicleRequest, MultipartFile image, User manager) throws IOException {
        if (vehicleRepository.existsByPlateNumber(vehicleRequest.getPlateNumber())) {
            throw new DuplicateResourceException("Vehicle with this plate number already exists.");
        }

        Vehicle vehicle = new Vehicle();
        mapDtoToVehicle(vehicle, vehicleRequest);
        vehicle.setManager(manager);

        if (image != null && !image.isEmpty()) {
            validateAndSetImage(vehicle, image);
        }

        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, VehicleRequestDTO vehicleRequest, MultipartFile image) throws IOException {
        Vehicle existing = getVehicleById(id);
        mapDtoToVehicle(existing, vehicleRequest);

        if (image != null && !image.isEmpty()) {
            validateAndSetImage(existing, image);
        } else if (vehicleRequest.getRemoveImage() != null && vehicleRequest.getRemoveImage()) {
            existing.setImage(null);
            existing.setImageContentType(null);
            existing.setImageSize(null);
        }

        return vehicleRepository.save(existing);
    }

    public void deleteVehicle(Long id) {
        Vehicle vehicle = getVehicleById(id);
        vehicleRepository.delete(vehicle);
    }

    public byte[] getVehicleImage(Long id) {
        Vehicle vehicle = getVehicleById(id);
        if (vehicle.getImage() == null) {
            throw new ResourceNotFoundException("Vehicle image not found for id: " + id);
        }
        return vehicle.getImage();
    }

    public String getVehicleImageContentType(Long id) {
        Vehicle vehicle = getVehicleById(id);
        if (vehicle.getImageContentType() == null) {
            throw new ResourceNotFoundException("Vehicle image content type not found for id: " + id);
        }
        return vehicle.getImageContentType();
    }

    public VehiclePictureResponse updateVehicleImage(Long vehicleId, MultipartFile file) throws IOException {
        Vehicle vehicle = getVehicleById(vehicleId);
        validateAndSetImage(vehicle, file);
        vehicleRepository.save(vehicle);

        VehiclePictureResponse response = new VehiclePictureResponse();
        response.setVehicleId(vehicleId);
        response.setFileName(file.getOriginalFilename());
        response.setMessage("Image uploaded successfully");
        return response;
    }

    private void validateAndSetImage(Vehicle vehicle, MultipartFile imageFile) throws IOException {
        if (imageFile.getSize() > MAX_IMAGE_SIZE) {
            throw new IllegalArgumentException("Image size must be less than 5MB");
        }

        String contentType = imageFile.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Only JPG, PNG, or GIF images are allowed");
        }

        vehicle.setImage(imageFile.getBytes());
        vehicle.setImageContentType(contentType);
        vehicle.setImageSize(imageFile.getSize());
    }

    private void mapDtoToVehicle(Vehicle vehicle, VehicleRequestDTO dto) {
        vehicle.setPlateNumber(dto.getPlateNumber());
        vehicle.setModel(dto.getModel());
        vehicle.setBrand(dto.getBrand());
        vehicle.setYear(dto.getYear());
        vehicle.setRatePerDay(dto.getRatePerDay());
        vehicle.setCapacity(dto.getCapacity());
        vehicle.setFuelType(dto.getFuelType());
        vehicle.setTransmission(dto.getTransmission());
        vehicle.setAvailability(dto.getAvailability() != null ? dto.getAvailability() : true);
        vehicle.setStatus(dto.getStatus());
        vehicle.setDescription(dto.getDescription());
    }
}