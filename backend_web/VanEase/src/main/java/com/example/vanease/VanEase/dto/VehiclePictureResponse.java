package com.example.vanease.VanEase.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Response object for vehicle image operations")
public class VehiclePictureResponse {
    @Schema(description = "Vehicle ID", example = "123")
    private Long vehicleId;

    @Schema(description = "Uploaded file name", example = "vehicle_image.jpg")
    private String fileName;

    @Schema(description = "Response message", example = "Vehicle image updated successfully")
    private String message;

    @Schema(description = "URL to access the vehicle image", example = "/api/vehicles/{vehicleId}/image")
    private String imageUrl;

    // Getters and Setters
    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    // Builder pattern
    public static VehiclePictureResponseBuilder builder() {
        return new VehiclePictureResponseBuilder();
    }

    public static class VehiclePictureResponseBuilder {
        private Long vehicleId;
        private String fileName;
        private String message;
        private String imageUrl;

        public VehiclePictureResponseBuilder vehicleId(Long vehicleId) {
            this.vehicleId = vehicleId;
            return this;
        }

        public VehiclePictureResponseBuilder fileName(String fileName) {
            this.fileName = fileName;
            return this;
        }

        public VehiclePictureResponseBuilder message(String message) {
            this.message = message;
            return this;
        }

        public VehiclePictureResponseBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public VehiclePictureResponse build() {
            return new VehiclePictureResponse(vehicleId, fileName, message, imageUrl);
        }
    }

    public VehiclePictureResponse() {
    }

    public VehiclePictureResponse(Long vehicleId, String fileName, String message, String imageUrl) {
        this.vehicleId = vehicleId;
        this.fileName = fileName;
        this.message = message;
        this.imageUrl = imageUrl;
    }
}