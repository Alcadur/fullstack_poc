package hamster.dev.fullstack_poc.dto;

import java.util.UUID;

public class TaskDTO {
    public UUID uuid;
    public UUID authorUuid;
    public String title;
    public String description;
    public boolean completed;
    public StepDTO[] steps;

    public static class StepDTO {
        public String title;
        public boolean completed;
    }
}
