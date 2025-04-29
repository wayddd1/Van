package com.example.vanease.VanEase.controller;

import com.example.vanease.VanEase.dto.PaymentRequestDTO;
import com.example.vanease.VanEase.model.Payment;
import com.example.vanease.VanEase.model.PaymentStatus;
import com.example.vanease.VanEase.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Endpoints for payment operations")
@Validated
public class PaymentController {

    private final PaymentService paymentService;

    @Operation(summary = "Create a payment")
    @PostMapping
    public Payment createPayment(@Valid @RequestBody PaymentRequestDTO paymentRequest) {
        return paymentService.createPayment(paymentRequest);
    }

    @Operation(summary = "Update payment status")
    @PatchMapping("/{paymentId}/status")
    public Payment updatePaymentStatus(@PathVariable Long paymentId, @RequestParam PaymentStatus status) {
        return paymentService.updatePaymentStatus(paymentId, status.name());
    }

    @Operation(summary = "Get payment by ID")
    @GetMapping("/{paymentId}")
    public Payment getPaymentById(@PathVariable Long paymentId) {
        return paymentService.getPaymentById(paymentId);
    }

    @Operation(summary = "Get all payments for a booking")
    @GetMapping("/booking/{bookingId}")
    public List<Payment> getPaymentsByBooking(@PathVariable Long bookingId) {
        return paymentService.getPaymentsByBooking(bookingId);
    }

    @Operation(summary = "Delete payment")
    @DeleteMapping("/{paymentId}")
    public void deletePayment(@PathVariable Long paymentId) {
        paymentService.deletePayment(paymentId);
    }
}