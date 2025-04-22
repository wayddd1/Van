package com.example.vanease.VanEase.service;

import com.example.vanease.VanEase.exception.ResourceNotFoundException;
import com.example.vanease.VanEase.model.Vehicle;
import com.example.vanease.VanEase.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public List<Vehicle> getAvailableVehicles() {
        return vehicleRepository.findByAvailabilityTrue();
    }

    public Vehicle getVehicleById(Integer id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
    }

    public Vehicle createVehicle(Vehicle vehicle) {
        if (vehicleRepository.existsByPlateNumber(vehicle.getPlateNumber())) {
            throw new IllegalArgumentException("Vehicle with plate number already exists");
        }
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Integer id, Vehicle vehicleDetails) {
        Vehicle vehicle = getVehicleById(id);
        vehicle.setModel(vehicleDetails.getModel());
        vehicle.setBrand(vehicleDetails.getBrand());
        vehicle.setYear(vehicleDetails.getYear());
        vehicle.setRentalRate(vehicleDetails.getRentalRate());
        vehicle.setAvailability(vehicleDetails.getAvailability());
        return vehicleRepository.save(vehicle);
    }

    public void deleteVehicle(Integer id) {
        Vehicle vehicle = getVehicleById(id);
        vehicleRepository.delete(vehicle);
    }
}
