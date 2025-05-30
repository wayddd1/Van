package com.example.vanease.VanEase.service;

import com.example.vanease.VanEase.dto.UserRequestDTO;
import com.example.vanease.VanEase.dto.UserResponseDTO;
import com.example.vanease.VanEase.model.Role;
import com.example.vanease.VanEase.model.User;
import com.example.vanease.VanEase.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponseDTO createUser(UserRequestDTO dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setPhone(dto.getPhoneNumber());
        user.setRole(Role.CUSTOMER);  // Assuming Role is an Enum like "CUSTOMER"
        user.setCreatedAt(new java.util.Date()); // Set current date as creation date

        User saved = userRepository.save(user);
        return mapToResponseDTO(saved);
    }

    public UserResponseDTO getUserResponseByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::mapToResponseDTO)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserResponseDTO getUserResponseById(Long userId) {
        return userRepository.findById(userId)
                .map(this::mapToResponseDTO)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
            .map(this::mapToResponseDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public UserResponseDTO updateUserStatus(Long userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        // Update the user status based on the string value
        switch (status.toUpperCase()) {
            case "ACTIVE":
                user.setEnabled(true);
                break;
            case "INACTIVE":
            case "SUSPENDED":
                user.setEnabled(false);
                break;
            default:
                throw new IllegalArgumentException("Invalid status value: " + status);
        }
        
        User savedUser = userRepository.save(user);
        return mapToResponseDTO(savedUser);
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // Typically the username/email
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found for email: " + email));
    }

    private UserResponseDTO mapToResponseDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhone());
        dto.setRole(user.getRole().name());
        dto.setStatus(user.isEnabled() ? "ACTIVE" : "INACTIVE");
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
