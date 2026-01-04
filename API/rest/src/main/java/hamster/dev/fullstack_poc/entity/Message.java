package hamster.dev.fullstack_poc.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "messages")
public class Message extends BaseEntity {
    @Getter
    @Setter
    private String content;

    @Getter
    @Setter
    @ManyToOne(targetEntity = User.class)
    @JoinColumn(nullable = false, updatable = false)
    private User sender;
}
