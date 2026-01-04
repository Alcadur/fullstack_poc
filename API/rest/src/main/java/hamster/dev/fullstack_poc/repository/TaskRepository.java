package hamster.dev.fullstack_poc.repository;

import hamster.dev.fullstack_poc.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
}
