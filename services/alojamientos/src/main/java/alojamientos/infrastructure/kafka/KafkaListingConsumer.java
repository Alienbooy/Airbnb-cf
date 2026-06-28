package alojamientos.infrastructure.kafka;

import alojamientos.application.ListingService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaListingConsumer {

    private final ListingService listingService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "listings.events", groupId = "alojamientos-group-v2")
    public void consume(String message) {
        log.info("Received Kafka message: {}", message);
        try {
            JsonNode root = objectMapper.readTree(message);
            String eventType = root.get("event").asText();
            JsonNode payload = root.get("payload");

            if ("ListingApprovedEvent".equals(eventType)) {
                UUID listingId = UUID.fromString(payload.get("listingId").asText());
                listingService.approveListing(listingId);
                log.info("Successfully approved listing {} via Kafka", listingId);
            } else if ("ListingRejectedEvent".equals(eventType)) {
                UUID listingId = UUID.fromString(payload.get("listingId").asText());
                listingService.rejectListing(listingId);
                log.info("Successfully rejected listing {} via Kafka", listingId);
            }
        } catch (Exception e) {
            log.error("Error processing Kafka message", e);
        }
    }
}
