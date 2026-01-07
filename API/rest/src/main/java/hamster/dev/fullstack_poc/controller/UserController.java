package hamster.dev.fullstack_poc.controller;

import hamster.dev.fullstack_poc.dto.LoginDTO;
import hamster.dev.fullstack_poc.dto.UserDTO;
import hamster.dev.fullstack_poc.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api")
@CrossOrigin
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/demo-users")
    UserDTO[] demoUsers () {
        return userService.getDemoUsers();
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody LoginDTO loginRequest, HttpSession session) {
        return userService.login(loginRequest.getUsername(), loginRequest.getPassword())
                .map(user -> {
                    Authentication authentication = new UsernamePasswordAuthenticationToken(
                            user, null, Collections.emptyList());

                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                            SecurityContextHolder.getContext());

                    return ResponseEntity.ok(user);
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @PostMapping("/logout")
    public void logout(HttpSession session) {
        session.invalidate();
    }
}
