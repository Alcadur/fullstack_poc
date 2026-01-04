package hamster.dev.fullstack_poc.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class UserDTO {
    private UUID uuid;
    private String username;
}
