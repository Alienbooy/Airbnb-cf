package alojamientos.application.dto;

import alojamientos.domain.ListingStatus;

import java.math.BigDecimal;
import java.util.UUID;

public record ListingResponse(
        UUID id,
        UUID hostId,
        String title,
        String description,
        String city,
        String type,
        Integer capacity,
        BigDecimal pricePerNight,
        String addressReference,
        String mainPhotoUrl,
        ListingStatus status
) {
}
