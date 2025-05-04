package com.example.vanease.VanEase.security.service;

import com.example.vanease.VanEase.model.User;
import com.example.vanease.VanEase.repository.UserRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final UserRepository userRepository;
    private final TokenBlacklistService tokenBlacklistService;

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    private Key getSigningKey() {
        byte[] keyBytes = java.util.Base64.getDecoder().decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Generate JWT Token
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "ROLE_" + user.getRole().name());
        return buildToken(claims, user.getEmail(), jwtExpiration);
    }

    // Generate refresh token
    public String generateRefreshToken(User user) {
        return buildToken(new HashMap<>(), user.getEmail(), refreshExpiration);
    }

    private String buildToken(Map<String, Object> claims, String subject, long expiration) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Validate JWT Token
    public boolean validateToken(String token) {
        try {
            String email = extractUsername(token);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            return isTokenValid(token, user);
        } catch (Exception e) {
            return false;
        }
    }

    // Check if the token is valid and not blacklisted
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) &&
                !isTokenExpired(token) &&
                !isTokenBlacklisted(token));
    }

    public boolean isTokenBlacklisted(String token) {
        return tokenBlacklistService.isTokenBlacklisted(token);
    }

    // Refresh token if valid
    public String refreshToken(String token) {
        if (!validateToken(token)) {
            throw new IllegalArgumentException("Invalid or expired token");
        }

        String email = extractUsername(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return generateToken(user);
    }

    // Extract username from token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
}
