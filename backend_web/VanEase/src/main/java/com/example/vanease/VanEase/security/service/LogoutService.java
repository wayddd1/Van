package com.example.vanease.VanEase.security.service;

import com.example.vanease.VanEase.security.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogoutService {

    private final TokenBlacklistService tokenBlacklistService;
    private final JwtService jwtService;

    public void logout(HttpServletRequest request, Authentication authentication) {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }

        final String jwt = authHeader.substring(7);
        tokenBlacklistService.blacklistToken(jwt);
    }
}