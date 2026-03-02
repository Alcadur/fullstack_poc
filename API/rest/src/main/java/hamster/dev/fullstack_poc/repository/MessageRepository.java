package hamster.dev.fullstack_poc.repository;

import hamster.dev.fullstack_poc.entity.Message;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    @Query("SELECT m FROM Message m ORDER BY m.createdAt DESC")
    List<Message> findLastMessages(Pageable pageable);
}
