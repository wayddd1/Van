package com.example.vanease.VanEase.dto;

import com.example.vanease.VanEase.model.PaymentMethod;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class PaymentRequestDTO {
    private Long bookingId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private String transactionId; // for PayPal/GCash
    private String proofUrl;      // for GCash uploads
}