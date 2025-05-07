package com.example.vanease.VanEase.dto;

import com.example.vanease.VanEase.model.PaymentMethod;
import com.example.vanease.VanEase.model.PaymentStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentResponseDTO {
    private Long paymentId;
    private Long bookingId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private String transactionId;
    private String proofUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}