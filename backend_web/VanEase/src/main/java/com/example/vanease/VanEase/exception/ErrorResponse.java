package com.example.vanease.VanEase.exception;

import java.util.List;
import java.util.Map;

public class ErrorResponse {
    private int status;
    private String error;
    private String message;
    private Map<String, String> fieldErrors;
    private List<String> details;

    public ErrorResponse() {
    }

    public ErrorResponse(String invalidCredentials) {
    }

    // Getters and setters (or use Lombok annotations like @Getter and @Setter)

    // Builder pattern implementation
    public static class Builder {
        private int status;
        private String error;
        private String message;
        private Map<String, String> fieldErrors;
        private List<String> details;

        public Builder status(int status) {
            this.status = status;
            return this;
        }

        public Builder error(String error) {
            this.error = error;
            return this;
        }

        public Builder message(String message) {
            this.message = message;
            return this;
        }

        public Builder fieldErrors(Map<String, String> fieldErrors) {
            this.fieldErrors = fieldErrors;
            return this;
        }

        public Builder details(List<String> details) {
            this.details = details;
            return this;
        }

        public ErrorResponse build() {
            ErrorResponse response = new ErrorResponse();
            response.status = this.status;
            response.error = this.error;
            response.message = this.message;
            response.fieldErrors = this.fieldErrors;
            response.details = this.details;
            return response;
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}