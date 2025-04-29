package com.example.vanease.VanEase.repository;

import com.example.vanease.VanEase.model.User;
import com.example.vanease.VanEase.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    boolean existsByPlateNumber(String plateNumber);
    List<Vehicle> findByAvailabilityTrue();

    List<Vehicle> findByManager(User manager);
}