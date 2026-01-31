package hamster.dev.fullstack_poc.controller;

import hamster.dev.fullstack_poc.dto.TaskDTO;
import hamster.dev.fullstack_poc.entity.User;
import hamster.dev.fullstack_poc.service.TaskService;
import hamster.dev.fullstack_poc.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
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

    @PostMapping("")
    public ResponseEntity<TaskDTO> addTask(
            @RequestBody TaskDTO taskDTO,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        assert user != null;

        return ResponseEntity.ok(taskService.createTask(user, taskDTO));
    }

    @Deprecated
    @GetMapping("/user/{userUuid}")
    public ResponseEntity<TaskDTO[]> getUserTasks(@PathVariable("userUuid") UUID userId) {
        return userService.findByUuid(userId)
                .map(user -> ResponseEntity.ok(taskService.getAllTasksByAuthor(user)))
                .orElse(ResponseEntity.status(HttpStatus.NO_CONTENT).build());
    }

    @Deprecated
    @GetMapping("/user/{userUuid}/todo")
    public ResponseEntity<TaskDTO[]> getUserTodoTasks(@PathVariable("userUuid") UUID userId) {
        return userService.findByUuid(userId)
                .map(user -> ResponseEntity.ok(taskService.getTodoTasksByAuthor(user)))
                .orElse(ResponseEntity.status(HttpStatus.NO_CONTENT).build());
    }

    @GetMapping("/todo")
    public ResponseEntity<TaskDTO[]> getUserTodoTasks(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(taskService.getTodoTasksByAuthor(user));
    }

    @GetMapping("/completed")
    public ResponseEntity<TaskDTO[]> getUserCompletedTasks(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(taskService.getCompletedTasksByAuthor(user));
    }

    @Deprecated
    @GetMapping("/user/{userUuid}/completed")
    public ResponseEntity<TaskDTO[]> getUserCompletedTasks(@PathVariable("userUuid") UUID userId) {
        return userService.findByUuid(userId)
                .map(user -> ResponseEntity.ok(taskService.getCompletedTasksByAuthor(user)))
                .orElse(ResponseEntity.status(HttpStatus.NO_CONTENT).build());
    }

    @PatchMapping("/user/{userUuid}/{taskUuid}")
    public ResponseEntity<TaskDTO> updateTaskStatus(
            @PathVariable("userUuid") UUID userId,
            @PathVariable("taskUuid") UUID taskUuid,
            @RequestBody boolean completed
    ) {
        return taskService.updateTaskStatus(taskUuid, userId, completed)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("")
    public ResponseEntity<TaskDTO> updateTaskStatus(
            @RequestBody TaskDTO taskDTO,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        assert user != null;
        if (!user.getUuid().equals(taskDTO.authorUuid)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return taskService.updateTask(taskDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
