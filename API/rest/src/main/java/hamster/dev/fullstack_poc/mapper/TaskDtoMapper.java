package hamster.dev.fullstack_poc.mapper;

import hamster.dev.fullstack_poc.dto.TaskDTO;
import hamster.dev.fullstack_poc.entity.Task;
import org.springframework.stereotype.Component;

@Component
public class TaskDtoMapper {
    public TaskDTO toDto(Task tasks) {
        TaskDTO dto = new TaskDTO();
        dto.uuid = tasks.getUuid();
        dto.authorUuid = tasks.getAuthor().getUuid();
        dto.title = tasks.getTitle();
        dto.description = tasks.getDescription();
        dto.completed = tasks.isCompleted();

        return dto;
    }
}
