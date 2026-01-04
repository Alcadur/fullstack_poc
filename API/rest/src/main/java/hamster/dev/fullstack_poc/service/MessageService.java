package hamster.dev.fullstack_poc.service;

import hamster.dev.fullstack_poc.entity.Message;
import hamster.dev.fullstack_poc.entity.User;
import hamster.dev.fullstack_poc.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;

    public void sendMessage(User sender, String content) {
        Message message = new Message();
        message.setSender(sender);
        message.setContent(content);
        messageRepository.save(message);
    }
}
