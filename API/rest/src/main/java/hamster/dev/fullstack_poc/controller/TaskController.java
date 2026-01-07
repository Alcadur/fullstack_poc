package hamster.dev.fullstack_poc.controller;

import hamster.dev.fullstack_poc.dto.TaskDTO;
import hamster.dev.fullstack_poc.service.TaskService;
import hamster.dev.fullstack_poc.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin
@RequiredArgsConstructor
@EnableWebSecurity
public class TaskController {
    private final TaskService taskService;
    private final UserService userService;

    @GetMapping("/user/{userUuid}")
    public ResponseEntity<TaskDTO[]> getUserTasks(@PathVariable("userUuid") UUID userId) {
        return userService.findByUuid(userId)
                .map(user -> ResponseEntity.ok(taskService.getAllTasksByAuthor(user)))
                .orElse(ResponseEntity.status(HttpStatus.NO_CONTENT).build());
    }
}
