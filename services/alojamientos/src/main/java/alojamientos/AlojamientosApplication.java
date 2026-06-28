package alojamientos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableKafka
public class AlojamientosApplication {

	public static void main(String[] args) {
		SpringApplication.run(AlojamientosApplication.class, args);
	}

}
