package com.example.vanease.VanEase.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Base64;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PayPalService {
    private static final String SANDBOX_BASE_URL = "https://api-m.sandbox.paypal.com";
    private final String clientId = "AY3ovFWX-WmVDEtLX0JJ-l0oP36y8Zm1WlKitZwv0DNYkbPsmFxeDHh99EWV9GYwJ2jd_0tcyChBuv5e";
    private final String secret = "EFFIJ-ufTiyMWD38-yQEPS2X-TLLSAivu0Znio1mu1XpJ9qbXNqkAeF-4jNC5pWRRIkjQCFUEOlIU7U0";

    /**
     * Verifies a PayPal transaction ID with the PayPal API
     * @param transactionId The PayPal transaction/order ID to verify
     * @return true if payment is verified as completed
     */
    public boolean verifyPayment(String transactionId) {
        try {
            // 1. Get OAuth2 token
            String accessToken = getAccessToken();

            // 2. Verify the transaction
            HttpHeaders verifyHeaders = new HttpHeaders();
            verifyHeaders.setBearerAuth(accessToken);
            HttpEntity<Void> verifyRequest = new HttpEntity<>(verifyHeaders);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> verifyResponse = restTemplate.exchange(
                    SANDBOX_BASE_URL + "/v2/checkout/orders/" + transactionId,
                    HttpMethod.GET,
                    verifyRequest,
                    Map.class);

            // Check status
            String status = (String) verifyResponse.getBody().get("status");
            log.info("PayPal transaction {} status: {}", transactionId, status);
            return "COMPLETED".equals(status);
        } catch (Exception e) {
            log.error("PayPal verification error: {}", e.getMessage(), e);
            return false;
        }
    }

    private String getAccessToken() {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(clientId, secret);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<String> request = new HttpEntity<>("grant_type=client_credentials", headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                SANDBOX_BASE_URL + "/v1/oauth2/token",
                request,
                Map.class);

        return (String) response.getBody().get("access_token");
    }
}