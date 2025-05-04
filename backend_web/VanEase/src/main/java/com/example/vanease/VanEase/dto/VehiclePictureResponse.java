package com.example.vanease.VanEase.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Schema(description = "Response object for vehicle image operations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehiclePictureResponse {
    @Schema(description = "Vehicle ID", example = "123")
    private Long vehicleId;

    @Schema(description = "Uploaded file name", example = "vehicle_image.jpg")
    private String fileName;

    @Schema(description = "Response message", example = "Vehicle image updated successfully")
    private String message;

    @Schema(description = "URL to access the vehicle image", example = "/api/vehicles/{vehicleId}/image")
    private String imageUrl;
}