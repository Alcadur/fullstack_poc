package hamster.dev.fullstack_poc;

import hamster.dev.fullstack_poc.entity.User;
import hamster.dev.fullstack_poc.service.MessageService;
import hamster.dev.fullstack_poc.service.TaskService;
import hamster.dev.fullstack_poc.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserService userService;
    @Autowired
    private TaskService taskService;

    @Autowired
    private MessageService messageService;

    @Override
    public void run(String... args) throws Exception {
        userService.createUser("Admin", "$trongPassword.123!");
        User Bella = userService.createDemoUser("Belle", "$trongPassword.123!");
        taskService.createTask(Bella, "Grocery shopping", "-bread, -tomato, -cucumber, -milk");
        taskService.createTask(Bella, "Tidying up the garden", "- sweep the leaves, - replant the flowers, - wash the greenhouse");

        User Alice = userService.createDemoUser("Alicia", "$trongPassword.123!");
        taskService.createTask(Alice, "Cleaning the bathroom", "-scrub the sink, -wipe the mirrors, -mop the floor", true);
        taskService.createTask(Alice, "Organizing the closet", "-sort the clothes, -fold the towels, -put away the shoes");
        taskService.createTask(Alice, "Clean the kitchen", "-wipe the counters, -wash the dishes, -vacuum the floor");

        User Tyrell = userService.createDemoUser("Tyrell", "$trongPassword.123!");
        taskService.createTask(Tyrell, "Car repair", "-order parts, -change the oil, -check the tires");
        taskService.createTask(Tyrell, "Party", "Remember to buy a gift for Alice's birthday party");
        taskService.createTask(Tyrell, "Home renovation", "-paint the walls, -replace the flooring, -install new cabinets");

        messageService.sendMessage(Bella, "Hello Alice, how are you doing today?");
        messageService.sendMessage(Alice, "I'm doing well, thanks for asking!");
        messageService.sendMessage(Tyrell, "Hey Alice, do you want to join me for a party this weekend?");
        messageService.sendMessage(Alice, "Sure, that sounds like fun!");

        User User500 = userService.createDemoUser("User500", "$trongPassword.123!");
        for (int i = 0; i < 100; i++) {
            taskService.createTask(User500, "Task to have bo done " + i, "Content " + i);
        }
        for (int i = 0; i < 400; i++) {
            taskService.createTask(User500, "Completed task " + i, "Completed content " + i, true);
        }
    }
}

