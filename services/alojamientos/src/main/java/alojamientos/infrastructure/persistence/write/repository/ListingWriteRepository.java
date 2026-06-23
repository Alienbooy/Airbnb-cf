package alojamientos.infrastructure.persistence.write.repository;

import alojamientos.infrastructure.persistence.write.entity.ListingWriteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ListingWriteRepository extends JpaRepository<ListingWriteEntity, UUID> {
}
