package com.example.vanease.VanEase.repository;

import com.example.vanease.VanEase.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {  // Change Integer to Long
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);

    // New: Find all users by role (CUSTOMER, MANAGER, ADMIN)
    List<User> findByRole(com.example.vanease.VanEase.model.Role role);
}
