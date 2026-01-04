package hamster.dev.fullstack_poc.service;

import hamster.dev.fullstack_poc.dto.UserDTO;
import hamster.dev.fullstack_poc.entity.User;
import hamster.dev.fullstack_poc.mapper.UserDtoMapper;
import hamster.dev.fullstack_poc.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final UserDtoMapper mapper;

    public User createDemoUser(String name, String password) {
        return createUser(name, password, true);
    }

    public User createUser(String name, String password) {
        return createUser(name, password, false);
    }

    public User createUser(String name, String password, boolean isDemo) {
        User user = new User();
        user.setUsername(name);
        user.setPassword(passwordEncoder.encode(password));
        user.setDemo(isDemo);

        return userRepository.save(user);
    }

    public UserDTO[] getDemoUsers() {
        return userRepository.findAllByIsDemo(true)
                .stream()
                .map(mapper::toDto)
                .toArray(UserDTO[]::new);
    }

    public Optional<UserDTO> login(String username, String password) {
        return userRepository.findByUsername(username)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .map(mapper::toDto);
    }
}
