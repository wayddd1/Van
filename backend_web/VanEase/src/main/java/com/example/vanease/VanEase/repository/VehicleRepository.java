package com.example.vanease.VanEase.repository;

import com.example.vanease.VanEase.model.User;
import com.example.vanease.VanEase.model.Vehicle;
import com.example.vanease.VanEase.model.VehicleFuelType;
import com.example.vanease.VanEase.model.VehicleStatus;
import com.example.vanease.VanEase.model.VehicleTransmissionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    boolean existsByPlateNumber(String plateNumber);

    List<Vehicle> findByAvailabilityTrue();

    List<Vehicle> findByManager(User manager);

    // New methods for filtering by enum values
    List<Vehicle> findByFuelType(VehicleFuelType fuelType);

    List<Vehicle> findByTransmission(VehicleTransmissionType transmission);

    List<Vehicle> findByStatus(VehicleStatus status);

    // Combined filter methods
    List<Vehicle> findByFuelTypeAndTransmission(VehicleFuelType fuelType, VehicleTransmissionType transmission);

    List<Vehicle> findByFuelTypeAndStatus(VehicleFuelType fuelType, VehicleStatus status);

    List<Vehicle> findByTransmissionAndStatus(VehicleTransmissionType transmission, VehicleStatus status);

    List<Vehicle> findByFuelTypeAndTransmissionAndStatus(
            VehicleFuelType fuelType,
            VehicleTransmissionType transmission,
            VehicleStatus status
    );

    // Filter by availability and other attributes
    List<Vehicle> findByAvailabilityAndFuelType(Boolean availability, VehicleFuelType fuelType);

    List<Vehicle> findByAvailabilityAndTransmission(Boolean availability, VehicleTransmissionType transmission);

    List<Vehicle> findByAvailabilityAndStatus(Boolean availability, VehicleStatus status);

    // Count methods for statistics
    long countByFuelType(VehicleFuelType fuelType);

    long countByTransmission(VehicleTransmissionType transmission);

    long countByStatus(VehicleStatus status);

    // Search methods for filtering
    List<Vehicle> findByBrandContainingIgnoreCaseOrModelContainingIgnoreCase(String brand, String model);
    
    // Find by status and availability
    List<Vehicle> findByStatusAndAvailability(VehicleStatus status, Boolean availability);
}