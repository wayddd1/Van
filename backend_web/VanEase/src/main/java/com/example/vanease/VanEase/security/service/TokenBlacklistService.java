package com.example.vanease.VanEase.security.service;

import com.example.vanease.VanEase.model.BlacklistedToken;
import com.example.vanease.VanEase.repository.BlacklistedTokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Base64;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private final BlacklistedTokenRepository repository;

    @Value("${jwt.secret}")
    private String secretKey;

    // Blacklist a token
    public void blacklistToken(String token) {
        LocalDateTime expiry = convertToLocalDateTime(extractExpiration(token));
        BlacklistedToken blacklistedToken = new BlacklistedToken();
        blacklistedToken.setToken(token);
        blacklistedToken.setExpiry(expiry);

        repository.save(blacklistedToken);
    }

    // Check if a token is already blacklisted
    public boolean isTokenBlacklisted(String token) {
        return repository.findByToken(token).isPresent();
    }

    // Extract expiration date from token
    private Date extractExpiration(String token) {
        byte[] decodedKey = Base64.getDecoder().decode(secretKey);

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(decodedKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getExpiration();
    }

    // Convert Date to LocalDateTime for database storage
    private LocalDateTime convertToLocalDateTime(Date date) {
        return Instant.ofEpochMilli(date.getTime())
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }
}
