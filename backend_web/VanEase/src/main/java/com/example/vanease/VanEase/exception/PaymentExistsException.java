package com.example.vanease.VanEase.exception;

public class PaymentExistsException extends RuntimeException {
    public PaymentExistsException(String message) {
        super(message);
    }
}