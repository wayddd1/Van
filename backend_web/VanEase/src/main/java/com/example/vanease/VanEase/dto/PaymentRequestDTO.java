package com.example.vanease.VanEase.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentRequestDTO {

    @NotNull
    private Long bookingId; // linked to Booking

    @NotNull
    private Double amount;

    @NotNull
    private String paymentMethod; // e.g., credit_card, paypal
}
