package com.example.vanease.VanEase.controller;

import com.example.vanease.VanEase.dto.UserRequestDTO;
import com.example.vanease.VanEase.dto.UserResponseDTO;
import com.example.vanease.VanEase.model.User;
import com.example.vanease.VanEase.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "Endpoints for user operations")
public class UserController {

    private final UserService userService;

    @Operation(summary = "Get the authenticated user's profile")
    @GetMapping("/profile")
    public UserResponseDTO getAuthenticatedUserProfile(@AuthenticationPrincipal User user) {
        return userService.getUserResponseById(user.getId());
    }

    @Operation(summary = "Register a new user")
    @PostMapping("/register")
    public UserResponseDTO registerUser(@Valid @RequestBody UserRequestDTO userRequestDTO) {
        return userService.createUser(userRequestDTO);
    }

    @Operation(summary = "Get user by email")
    @GetMapping("/email/{email}")
    public UserResponseDTO getUserByEmail(@PathVariable String email) {
        return userService.getUserResponseByEmail(email);
    }

    @Operation(summary = "Get user by ID")
    @GetMapping("/{userId}")
    public UserResponseDTO getUserById(@PathVariable Long userId) {
        return userService.getUserResponseById(userId);
    }

    @Operation(summary = "Check if email exists")
    @GetMapping("/exists/{email}")
    public boolean existsByEmail(@PathVariable String email) {
        return userService.existsByEmail(email);
    }
    
    @Operation(summary = "Get all users - manager only")
    @GetMapping("/all")
    @PreAuthorize("hasRole('MANAGER')")
    public List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsers();
    }
    
    @Operation(summary = "Update user status - manager only")
    @PatchMapping("/{userId}/status")
    @PreAuthorize("hasRole('MANAGER')")
    public UserResponseDTO updateUserStatus(
            @PathVariable Long userId,
            @RequestBody Map<String, String> statusUpdate) {
        String newStatus = statusUpdate.get("status");
        if (newStatus == null || newStatus.isEmpty()) {
            throw new IllegalArgumentException("Status cannot be empty");
        }
        return userService.updateUserStatus(userId, newStatus);
    }

}
