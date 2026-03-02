package hamster.dev.fullstack_poc.service;

import hamster.dev.fullstack_poc.entity.Message;
import hamster.dev.fullstack_poc.entity.User;
import hamster.dev.fullstack_poc.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.PageRequest;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;

    public Message savedMessage(User sender, String content) {
        Message message = new Message();
        message.setSender(sender);
        message.setContent(content);
        return messageRepository.save(message);
    }

    public Collection<Message> getLastMessages(int limit) {
        List<Message> messages = messageRepository.findLastMessages(PageRequest.of(0, limit));
        Collections.reverse(messages);
        return messages;
    }
}
