package hamster.dev.fullstack_poc.mapper;

import hamster.dev.fullstack_poc.dto.TaskDTO;
import hamster.dev.fullstack_poc.entity.Task;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class TaskDtoMapper {
    public TaskDTO toDto(Task tasks) {
        TaskDTO dto = new TaskDTO();
        dto.uuid = tasks.getUuid();
        dto.authorUuid = tasks.getAuthor().getUuid();
        dto.title = tasks.getTitle();
        dto.completed = tasks.isCompleted();


        String fullDescription = tasks.getDescription();
        String[] descriptionParts = fullDescription.split("\\[API:STEPS\\]");
        dto.description = descriptionParts[0];
        dto.steps = new TaskDTO.StepDTO[0];
        if (descriptionParts.length == 1) {
            return dto;
        }

        dto.steps = Arrays.stream(descriptionParts[1].split("-"))
                .filter(stepString -> !stepString.trim().isEmpty())
                .map(stepString -> {
                    TaskDTO.StepDTO step = new TaskDTO.StepDTO();
                    step.completed = stepString.startsWith("[x]");
                    step.title = stepString.substring(stepString.indexOf("]") + 1);
                    return step;
                }).toArray(TaskDTO.StepDTO[]::new);

        return dto;
    }

    public Task toEntity(TaskDTO dto) {
        Task task = new Task();
        task.setTitle(dto.title);
        task.setCompleted(dto.completed);

        StringBuilder fullDescription = new StringBuilder(dto.description + "[API:STEPS]");
        for (int i = 0; i < dto.steps.length; i++) {
            TaskDTO.StepDTO step = dto.steps[i];
            fullDescription.append("-[").append(step.completed ? "x" : "").append("]").append(step.title);
        }
        task.setDescription(fullDescription.toString());

        return task;
    }
}
