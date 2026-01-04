package hamster.dev.fullstack_poc.mapper;

import hamster.dev.fullstack_poc.dto.UserDTO;
import hamster.dev.fullstack_poc.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserDtoMapper {
    public UserDTO toDto(User user) {
        UserDTO dto = new UserDTO();
        dto.setUuid(user.getUuid());
        dto.setUsername(user.getUsername());

        return dto;
    }
}
