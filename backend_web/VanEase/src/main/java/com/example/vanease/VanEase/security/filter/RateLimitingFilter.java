package com.example.vanease.VanEase.security.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RateLimitingFilter implements Filter {

    private static final int MAX_REQUESTS_PER_MINUTE = 10;
    private final ConcurrentHashMap<String, RequestCounter> requestCounts = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String ipAddress = httpRequest.getRemoteAddr();

        RequestCounter counter = requestCounts.computeIfAbsent(ipAddress, k -> new RequestCounter());

        synchronized (counter) {
            if (counter.count >= MAX_REQUESTS_PER_MINUTE) {
                ((HttpServletResponse) response).sendError(429, "Too many requests");
                return;
            }
            counter.count++;
        }

        chain.doFilter(request, response);
    }

    private static class RequestCounter {
        int count = 0;
        long lastResetTime = System.currentTimeMillis();

        RequestCounter() {
            // Schedule reset
            new Thread(() -> {
                while (true) {
                    try {
                        TimeUnit.MINUTES.sleep(1);
                        synchronized (this) {
                            count = 0;
                            lastResetTime = System.currentTimeMillis();
                        }
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                }
            }).start();
        }
    }
}