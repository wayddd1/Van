package com.example.vanease.VanEase.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NotificationRequestDTO {
    @NotNull
    private Long userId;

    @NotBlank
    private String message;
}