package com.example.vanease.VanEase.controller;

import com.example.vanease.VanEase.model.Notification;
import com.example.vanease.VanEase.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Endpoints for notification operations")
public class NotificationController {

    private final NotificationService notificationService;

    @Operation(summary = "Create a notification for a user")
    @PostMapping
    public Notification createNotification(@RequestParam Long userId, @RequestParam String message) {
        return notificationService.createNotification(userId, message);
    }

    @Operation(summary = "Mark notification as read")
    @PatchMapping("/{notificationId}/read")
    public Notification markAsRead(@PathVariable Integer notificationId) {
        return notificationService.markAsRead(notificationId);
    }

    @Operation(summary = "Get notifications for a user")
    @GetMapping("/user/{userId}")
    public List<Notification> getNotificationsByUser(@PathVariable Long userId) {
        return notificationService.getNotificationsByUser(userId);
    }

    @Operation(summary = "Delete notification")
    @DeleteMapping("/{notificationId}")
    public void deleteNotification(@PathVariable Integer notificationId) {
        notificationService.deleteNotification(notificationId);
    }
}