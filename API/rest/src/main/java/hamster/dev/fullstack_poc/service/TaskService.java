package hamster.dev.fullstack_poc.service;

import hamster.dev.fullstack_poc.dto.TaskDTO;
import hamster.dev.fullstack_poc.entity.Task;
import hamster.dev.fullstack_poc.entity.User;
import hamster.dev.fullstack_poc.mapper.TaskDtoMapper;
import hamster.dev.fullstack_poc.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final TaskDtoMapper mapper;

    public void createTask(User author, String title, String description) {
        createTask(author, title, description, false);
    }

    public void createTask(User author, String title, String description, boolean completed) {
        Task task = new Task();
        task.setTitle(title);
        task.setDescription(description);
        task.setAuthor(author);
        task.setCompleted(completed);
        taskRepository.save(task);
    }

    public TaskDTO[] getTodoTasksByAuthor(User user) {
        return taskRepository.findAllByAuthorAndCompleted(user, false)
                .stream()
                .map(mapper::toDto)
                .toArray(TaskDTO[]::new);
    }

    public TaskDTO[] getCompletedTasksByAuthor(User user) {
        return taskRepository.findAllByAuthorAndCompleted(user, true)
                .stream()
                .map(mapper::toDto)
                .toArray(TaskDTO[]::new);
    }

    public TaskDTO[] getAllTasksByAuthor(User user) {
        return taskRepository.findAllByAuthorOrderByCompleted(user)
                .stream()
                .map(mapper::toDto)
                .toArray(TaskDTO[]::new);
    }

    public Optional<TaskDTO> updateTask(TaskDTO taskDTO) {
        return taskRepository.findByUuid(taskDTO.uuid)
                .map(task -> {
                    Task tmpTask = mapper.toEntity(taskDTO);
                    task.setTitle(tmpTask.getTitle());
                    task.setDescription(tmpTask.getDescription());
                    task.setCompleted(tmpTask.isCompleted());

                    return mapper.toDto(taskRepository.save(task));
                });
    }

    public Optional<TaskDTO> updateTaskStatus(UUID taskUuid, UUID userUuid, boolean completed) {
        return taskRepository.findByUuidAndAuthorUuid(taskUuid, userUuid)
                .map(task -> {
                    task.setCompleted(completed);
                    return mapper.toDto(taskRepository.save(task));
                });
    }
}
