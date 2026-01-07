package hamster.dev.fullstack_poc.service;

import hamster.dev.fullstack_poc.dto.TaskDTO;
import hamster.dev.fullstack_poc.entity.Task;
import hamster.dev.fullstack_poc.entity.User;
import hamster.dev.fullstack_poc.mapper.TaskDtoMapper;
import hamster.dev.fullstack_poc.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final TaskDtoMapper mapper;

    public void createTask(User author, String title, String description) {
        Task task = new Task();
        task.setTitle(title);
        task.setDescription(description);
        task.setAuthor(author);
        taskRepository.save(task);
    }

    public TaskDTO[] getAllTasksByAuthor(User user) {
        return taskRepository.findAllByAuthor(user).stream().map(mapper::toDto).toArray(TaskDTO[]::new);
    }
}
