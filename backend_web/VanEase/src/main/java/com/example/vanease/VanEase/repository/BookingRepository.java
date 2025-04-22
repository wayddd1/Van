package com.example.vanease.VanEase.repository;

import com.example.vanease.VanEase.model.Booking;
import com.example.vanease.VanEase.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {

    List<Booking> findByUser_UserId(Integer userId);

    List<Booking> findByVehicle_VehicleId(Integer vehicleId);

    @Query("SELECT b FROM Booking b WHERE " +
            "b.vehicle.vehicleId = :vehicleId AND " +
            "b.status IN (com.example.vanease.VanEase.model.BookingStatus.PENDING, " +
            "com.example.vanease.VanEase.model.BookingStatus.CONFIRMED) AND " +
            "((b.startDate BETWEEN :startDate AND :endDate) OR " +
            "(b.endDate BETWEEN :startDate AND :endDate) OR " +
            "(b.startDate <= :startDate AND b.endDate >= :endDate))")
    List<Booking> findActiveBookingsForVehicle(
            @Param("vehicleId") Integer vehicleId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}