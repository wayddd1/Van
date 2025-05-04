package com.example.vanease.VanEase.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "plate_number", unique = true, nullable = false)
    private String plateNumber;

    @NotBlank
    @Column(nullable = false)
    private String model;

    @NotBlank
    @Column(nullable = false)
    private String brand;

    @NotNull
    @Min(1886) // The year the first car was invented
    @Column(nullable = false)
    private Integer year;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Digits(integer = 8, fraction = 2)
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal ratePerDay;

    @NotNull
    @Min(1)
    @Column(nullable = false)
    private Integer capacity;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleFuelType fuelType;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleTransmissionType transmission;

    @NotNull
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean availability = true;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleStatus status;

    @Size(max = 500)
    private String description;

    @Lob
    @Column(name = "image", columnDefinition = "LONGBLOB")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;

    @Column(name = "image_size")
    private Long imageSize;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id", nullable = false)
    private User manager;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings;
}