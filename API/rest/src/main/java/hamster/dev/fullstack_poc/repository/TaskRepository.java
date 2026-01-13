package hamster.dev.fullstack_poc.repository;

import hamster.dev.fullstack_poc.entity.Task;
import hamster.dev.fullstack_poc.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
    Collection<Task> findAllByAuthorOrderByCompleted(User author);
    Collection<Task> findAllByAuthorAndCompleted(User author, boolean completed);
    Optional<Task> findByUuidAndAuthorUuid(UUID taskUuid, UUID authorUuid);
}
