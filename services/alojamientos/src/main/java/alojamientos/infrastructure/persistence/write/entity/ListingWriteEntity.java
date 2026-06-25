package alojamientos.infrastructure.persistence.write.entity;

import alojamientos.domain.ListingStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "listings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListingWriteEntity {
    @Id
    private UUID id;

    @Column(name = "host_id", nullable = false)
    private UUID hostId;

    @Column(nullable = false, length = 1000)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 50)
    private String type;

    @Column(nullable = false)
    private Integer capacity;

    @Column(name = "price_per_night", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerNight;

    @Column(name = "address_reference", length = 250)
    private String addressReference;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ListingStatus status;

    @Column(name = "main_photo_url")
    private String mainPhotoUrl;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
