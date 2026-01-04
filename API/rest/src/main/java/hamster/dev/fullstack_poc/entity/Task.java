package hamster.dev.fullstack_poc.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "tasks")
public class Task extends BaseEntity {
    @ManyToOne(targetEntity = User.class)
    @JoinColumn(updatable = false, nullable = false)
    @Getter
    @Setter
    private User author;

    @Getter
    @Setter
    private String title;

    @Getter
    @Setter
    private String description;

    @Getter
    @Setter
    private boolean completed;
}
