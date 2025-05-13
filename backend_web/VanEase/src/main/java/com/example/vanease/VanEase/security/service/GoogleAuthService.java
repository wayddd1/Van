package com.example.vanease.VanEase.security.service;

import com.example.vanease.VanEase.dto.GoogleAuthRequest;
import com.example.vanease.VanEase.model.Role;
import com.example.vanease.VanEase.model.User;
import com.example.vanease.VanEase.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.Optional;
import org.json.JSONObject;

import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class GoogleAuthService {

    private static final Logger log = LoggerFactory.getLogger(GoogleAuthService.class);

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Value("${google.client.id}")
    private String googleClientId;

    public ResponseEntity<?> authenticateWithGoogle(GoogleAuthRequest request) {
        try {
            log.info("Received Google auth request with credential: {}", 
                    request.getCredential() != null ? request.getCredential().substring(0, Math.min(20, request.getCredential().length())) + "..." : "null");
            
            if (request.getCredential() == null || request.getCredential().isEmpty()) {
                log.error("Missing credential in Google auth request");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Missing credential"));
            }
            
            // Parse the JWT token (Google ID token is a JWT)
            String[] parts = request.getCredential().split("\\.");
            if (parts.length != 3) {
                log.error("Invalid token format");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Invalid token format"));
            }
            
            // Decode the payload (second part of the JWT)
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
            JSONObject jsonPayload = new JSONObject(payload);
            
            log.info("Successfully parsed token payload");
            
            // Extract user information
            String email = jsonPayload.optString("email", "");
            String name = jsonPayload.optString("name", "");
            String pictureUrl = jsonPayload.optString("picture", "");
            
            if (email.isEmpty()) {
                log.error("Email not found in token payload");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Email not found in token"));
            }
            
            log.info("Google authentication successful for email: {}", email);
            
            // Check if user exists in the database
            Optional<User> existingUser = userRepository.findByEmail(email);
            User user;
            
            if (existingUser.isPresent()) {
                user = existingUser.get();
                log.info("Existing user found for Google OAuth: {}", email);
                
                // Update user information if needed
                if (!name.isEmpty() && !name.equals(user.getName())) {
                    user.setName(name);
                    userRepository.save(user);
                    log.info("Updated existing user's name from Google OAuth");
                }
            } else {
                // Create a new user if not exists
                user = new User();
                user.setEmail(email);
                user.setName(name.isEmpty() ? email.split("@")[0] : name); // Use email username if name is empty
                user.setRole(Role.CUSTOMER); // Default role for Google OAuth users
                user.setEnabled(true);
                
                // Set a default phone number since Google doesn't provide one
                user.setPhone("Not provided"); // Default value for Google OAuth users
                
                // Generate a random password for the user (they will never use it)
                String randomPassword = UUID.randomUUID().toString();
                user.setPassword(passwordEncoder.encode(randomPassword));
                
                userRepository.save(user);
                log.info("Created new user from Google OAuth: {}", email);
            }
            
            // Generate JWT tokens
            String token = jwtService.generateToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);
            
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("name", user.getName());
            userData.put("email", user.getEmail());
            userData.put("role", user.getRole());
            
            Map<String, Object> response = new HashMap<>();
            // Support both naming conventions for compatibility with frontend
            response.put("token", token);
            response.put("accessToken", token);
            response.put("refreshToken", refreshToken);
            response.put("user", userData);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Google authentication error", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Authentication failed: " + e.getMessage()));
        }
    }
}