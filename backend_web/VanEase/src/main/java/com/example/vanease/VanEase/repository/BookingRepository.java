package com.example.vanease.VanEase.repository;

import com.example.vanease.VanEase.model.Booking;
import com.example.vanease.VanEase.model.BookingStatus;
import com.example.vanease.VanEase.model.User;
import com.example.vanease.VanEase.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUser(User user);

    List<Booking> findByVehicle(Vehicle vehicle);

    List<Booking> findByStatus(BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.status IN (com.example.vanease.VanEase.model.BookingStatus.PENDING, com.example.vanease.VanEase.model.BookingStatus.CONFIRMED)")
    List<Booking> findActiveBookings();

    @Query("SELECT b FROM Booking b WHERE " +
            "(b.startDate BETWEEN :startDate AND :endDate) OR " +
            "(b.endDate BETWEEN :startDate AND :endDate) OR " +
            "(b.startDate <= :startDate AND b.endDate >= :endDate)")
    List<Booking> findBookingsBetweenDates(@Param("startDate") LocalDate startDate,
                                           @Param("endDate") LocalDate endDate);

    @Query("SELECT b FROM Booking b WHERE b.vehicle = :vehicle AND " +
            "((b.startDate BETWEEN :startDate AND :endDate) OR " +
            "(b.endDate BETWEEN :startDate AND :endDate) OR " +
            "(b.startDate <= :startDate AND b.endDate >= :endDate)) AND " +
            "b.status IN (com.example.vanease.VanEase.model.BookingStatus.PENDING, com.example.vanease.VanEase.model.BookingStatus.CONFIRMED)")
    List<Booking> findOverlappingBookings(@Param("vehicle") Vehicle vehicle,
                                          @Param("startDate") LocalDate startDate,
                                          @Param("endDate") LocalDate endDate);

    List<Booking> findByUserAndStatus(User user, BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.user = :user AND b.endDate >= :currentDate ORDER BY b.startDate ASC")
    List<Booking> findUpcomingBookingsByUser(@Param("user") User user,
                                             @Param("currentDate") LocalDate currentDate);

    @Query("SELECT b FROM Booking b WHERE b.user = :user AND b.endDate < :currentDate ORDER BY b.endDate DESC")
    List<Booking> findPastBookingsByUser(@Param("user") User user,
                                         @Param("currentDate") LocalDate currentDate);
}