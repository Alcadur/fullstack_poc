package hamster.dev.fullstack_poc.repository;

import hamster.dev.fullstack_poc.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Collection<User> findAllByIsDemo(boolean isDemo);
    Optional<User> findByUsername(String username);
}
