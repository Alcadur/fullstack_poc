package hamster.dev.fullstack_poc.repository;

import hamster.dev.fullstack_poc.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
}
