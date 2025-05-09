package com.example.vanease.VanEase.dto;

import lombok.Data;
import java.util.Date;

@Data
public class UserResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private String address;
    private String role;
    private String status;
    private Date createdAt;
}
