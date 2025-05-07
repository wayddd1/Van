package com.example.vanease.VanEase.controller;

import com.example.vanease.VanEase.dto.PaymentRequestDTO;
import com.example.vanease.VanEase.model.Payment;
import com.example.vanease.VanEase.model.PaymentMethod;
import com.example.vanease.VanEase.model.PaymentStatus;
import com.example.vanease.VanEase.model.User;
import com.example.vanease.VanEase.model.Role;
import com.example.vanease.VanEase.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    // Create a new payment (requires authentication)
    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody PaymentRequestDTO dto, @RequestAttribute User user) {
        return ResponseEntity.ok(paymentService.createPayment(dto, user));
    }
    
    // Create a new payment (public endpoint for testing)
    @PostMapping("/create")
    public ResponseEntity<Payment> createPaymentPublic(@RequestBody PaymentRequestDTO dto) {
        // For testing purposes, we'll create a dummy user
        User dummyUser = new User();
        dummyUser.setId(1L); // Use a dummy ID
        dummyUser.setEmail("customer@example.com");
        dummyUser.setRole(Role.CUSTOMER);
        
        return ResponseEntity.ok(paymentService.createPayment(dto, dummyUser));
    }

    // Get all payments for a booking
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<Payment>> getPaymentsByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(paymentService.getPaymentsByBooking(bookingId));
    }

    // Get all payments by method
    @GetMapping("/method/{method}")
    public ResponseEntity<List<Payment>> getPaymentsByMethod(@PathVariable PaymentMethod method) {
        return ResponseEntity.ok(paymentService.getPaymentsByMethod(method));
    }

    // Get all payments by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Payment>> getPaymentsByStatus(@PathVariable PaymentStatus status) {
        return ResponseEntity.ok(paymentService.getPaymentsByStatus(status));
    }

    // Update payment status (for admin/manual verification)
    @PatchMapping("/{paymentId}/status")
    public ResponseEntity<Payment> updatePaymentStatus(
            @PathVariable Long paymentId,
            @RequestParam PaymentStatus status) {
        return ResponseEntity.ok(paymentService.updatePaymentStatus(paymentId, status));
    }
}