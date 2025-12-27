package hamster.dev.fullstack_poc.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "tasks")
public class Task extends BaseEntity {
    @ManyToOne(targetEntity = User.class)
    @JoinColumn(updatable = false, nullable = false)
    private UUID author;
    private String title;
    private String description;
    private boolean completed;
}
