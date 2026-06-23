package alojamientos.application.dto;

import alojamientos.domain.ListingStatus;

import java.math.BigDecimal;
import java.util.UUID;

public record SearchListingResponse(
        UUID id,
        String title,
        String city,
        String type,
        Integer capacity,
        BigDecimal pricePerNight,
        String mainPhotoUrl,
        ListingStatus status
) {
}
