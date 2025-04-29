package com.example.vanease.VanEase.controller;

import com.example.vanease.VanEase.dto.VehiclePictureResponse;
import com.example.vanease.VanEase.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping("/{vehicleId}/image")
    public ResponseEntity<byte[]> getVehicleImage(@PathVariable Long vehicleId) {
        byte[] image = vehicleService.getVehicleImage(vehicleId);
        String contentType = vehicleService.getVehicleImageContentType(vehicleId);

        if (image == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(image);
    }

    @PostMapping(value = "/{vehicleId}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VehiclePictureResponse> uploadVehicleImage(@PathVariable Long vehicleId, @RequestParam("file") MultipartFile file) throws IOException {
        VehiclePictureResponse response = vehicleService.updateVehicleImage(vehicleId, file);
        return ResponseEntity.ok(response);
    }
}