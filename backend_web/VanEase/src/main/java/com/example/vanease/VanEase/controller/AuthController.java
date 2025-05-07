package com.example.vanease.VanEase.controller;

import com.example.vanease.VanEase.exception.ErrorResponse;
import com.example.vanease.VanEase.dto.LoginRequest;
import com.example.vanease.VanEase.dto.RegisterRequest;
import com.example.vanease.VanEase.model.Role;
import com.example.vanease.VanEase.security.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest; // Fixed import
import java.util.Map;

@RestController
@RequestMapping({"/auth", "/api/auth"})
@Tag(name = "Authentication", description = "Endpoints for user authentication and registration")
@RequiredArgsConstructor
public class AuthController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            log.info("Login attempt for user: {}", loginRequest.getEmail());
            ResponseEntity<?> response = authService.authenticateUser(loginRequest);
            log.info("Login successful for user: {}", loginRequest.getEmail());
            return response;
        } catch (Exception e) {
            log.error("Login failed for user {}: {}", loginRequest.getEmail(), e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Invalid credentials: " + e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(authService.registerUser(request, Role.CUSTOMER));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @PostMapping("/register/manager")
    public ResponseEntity<?> registerManager(@RequestBody RegisterRequest request) {
        try {
            // Validate request
            if (request.getEmail() == null || request.getPassword() == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Email and password are required"));
            }

            return authService.registerUser(request, Role.MANAGER);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, Authentication authentication) {
        return authService.logoutUser(request, authentication);
    }

    @Operation(summary = "Refresh token", description = "Endpoint to refresh the JWT token")
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        log.info("Refresh token request received with header: {}", authHeader != null ? "present" : "missing");
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String refreshToken = authHeader.substring(7);
            try {
                log.info("Attempting to refresh token");
                ResponseEntity<?> response = authService.refreshToken(refreshToken);
                log.info("Token refresh successful");
                return response;
            } catch (Exception e) {
                log.error("Token refresh failed: {}", e.getMessage());
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Invalid refresh token: " + e.getMessage()));
            }
        }
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("No refresh token provided"));
    }
}