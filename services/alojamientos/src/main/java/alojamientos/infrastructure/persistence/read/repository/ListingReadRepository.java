package alojamientos.infrastructure.persistence.read.repository;

import alojamientos.domain.ListingStatus;
import alojamientos.infrastructure.persistence.read.entity.ListingReadEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ListingReadRepository extends JpaRepository<ListingReadEntity, UUID> {
    List<ListingReadEntity> findByCityIgnoreCaseAndStatus(String city, ListingStatus status);
}
