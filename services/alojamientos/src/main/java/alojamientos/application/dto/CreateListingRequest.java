package alojamientos.application.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record CreateListingRequest(
        @NotBlank
        @Size(max = 150)
        String title,

        @NotBlank
        @Size(max = 1000)
        String description,

        @NotBlank
        @Size(max = 100)
        String city,

        @NotBlank
        @Size(max = 50)
        String type,

        @NotNull
        @Min(1)
        Integer capacity,

        @NotNull
        @DecimalMin("1.00")
        BigDecimal pricePerNight,

        @Size(max = 250)
        String addressReference,

        String mainPhotoUrl
) {
}
