package alojamientos.presentation;


import alojamientos.application.ListingService;
import alojamientos.application.dto.CreateListingRequest;
import alojamientos.application.dto.ListingResponse;
import alojamientos.application.dto.SearchListingResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
public class ListingController {
    private final ListingService listingService;

    @PostMapping
    @PreAuthorize("hasRole('HOST') or hasRole('ADMIN')")
    public ListingResponse createListing(
            @RequestHeader("X-Host-Id") UUID hostId,
            @Valid @RequestBody CreateListingRequest request
    ) {
        return listingService.createListing(hostId, request);
    }

    @GetMapping("/host")
    @PreAuthorize("hasRole('HOST') or hasRole('ADMIN')")
    public List<ListingResponse> getHostListings(@RequestHeader("X-Host-Id") UUID hostId) {
        return listingService.findByHost(hostId);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ListingResponse> getAllForAdmin() {
        return listingService.findAllForAdmin();
    }

    @GetMapping("/{id}")
    public ListingResponse getById(@PathVariable UUID id) {
        return listingService.getById(id);
    }

    @GetMapping
    public List<SearchListingResponse> searchByCity(@RequestParam(required = false) String city) {
        return listingService.searchByCity(city);
    }

}
