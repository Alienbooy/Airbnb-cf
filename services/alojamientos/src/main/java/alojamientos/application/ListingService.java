package alojamientos.application;

import alojamientos.application.dto.CreateListingRequest;
import alojamientos.application.dto.ListingResponse;
import alojamientos.application.dto.SearchListingResponse;
import alojamientos.domain.ListingStatus;
import alojamientos.infrastructure.persistence.read.entity.ListingReadEntity;
import alojamientos.infrastructure.persistence.read.repository.ListingReadRepository;
import alojamientos.infrastructure.persistence.write.entity.ListingWriteEntity;
import alojamientos.infrastructure.persistence.write.repository.ListingWriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ListingService {
    private final ListingWriteRepository writeRepository;
    private final ListingReadRepository readRepository;

    public ListingResponse createListing(UUID hostId, CreateListingRequest request) {
        UUID listingId = UUID.randomUUID();
        LocalDateTime now = LocalDateTime.now();

        ListingWriteEntity listing = ListingWriteEntity.builder()
                .id(listingId)
                .hostId(hostId)
                .title(request.title())
                .description(request.description())
                .city(request.city())
                .type(request.type())
                .capacity(request.capacity())
                .pricePerNight(request.pricePerNight())
                .addressReference(request.addressReference())
                .mainPhotoUrl(request.mainPhotoUrl())
                .status(ListingStatus.PENDING)
                .createdAt(now)
                .updatedAt(now)
                .build();
        ListingWriteEntity saved = writeRepository.save(listing);
        syncReadModel(saved);
        return toResponse(saved);
    }

    public ListingResponse getById(UUID id) {
        ListingWriteEntity listing = writeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alojamiento no encontrado"));

        return toResponse(listing);
    }

    public List<SearchListingResponse> searchByCity(String city) {
        return readRepository
                .findByCityIgnoreCaseAndStatus(city, ListingStatus.APPROVED)
                .stream()
                .map(this::toSearchResponse)
                .toList();
    }

    @Transactional("writeTransactionManager")
    public ListingResponse approveListing(UUID id) {
        ListingWriteEntity listing = writeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alojamiento no encontrado"));

        listing.setStatus(ListingStatus.APPROVED);
        listing.setUpdatedAt(LocalDateTime.now());

        ListingWriteEntity saved = writeRepository.save(listing);

        syncReadModel(saved);

        return toResponse(saved);
    }

    @Transactional("writeTransactionManager")
    public ListingResponse rejectListing(UUID id) {
        ListingWriteEntity listing = writeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alojamiento no encontrado"));

        listing.setStatus(ListingStatus.REJECTED);
        listing.setUpdatedAt(LocalDateTime.now());

        ListingWriteEntity saved = writeRepository.save(listing);

        syncReadModel(saved);

        return toResponse(saved);
    }

    private void syncReadModel(ListingWriteEntity listing) {
        ListingReadEntity readEntity = ListingReadEntity.builder()
                .id(listing.getId())
                .title(listing.getTitle())
                .city(listing.getCity())
                .type(listing.getType())
                .capacity(listing.getCapacity())
                .pricePerNight(listing.getPricePerNight())
                .mainPhotoUrl(listing.getMainPhotoUrl())
                .status(listing.getStatus())
                .build();

        readRepository.save(readEntity);
    }

    private ListingResponse toResponse(ListingWriteEntity listing) {
        return new ListingResponse(
                listing.getId(),
                listing.getHostId(),
                listing.getTitle(),
                listing.getDescription(),
                listing.getCity(),
                listing.getType(),
                listing.getCapacity(),
                listing.getPricePerNight(),
                listing.getAddressReference(),
                listing.getMainPhotoUrl(),
                listing.getStatus()
        );
    }

    private SearchListingResponse toSearchResponse(ListingReadEntity listing) {
        return new SearchListingResponse(
                listing.getId(),
                listing.getTitle(),
                listing.getCity(),
                listing.getType(),
                listing.getCapacity(),
                listing.getPricePerNight(),
                listing.getMainPhotoUrl(),
                listing.getStatus()
        );
    }
}
