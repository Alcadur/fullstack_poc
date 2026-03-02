package hamster.dev.fullstack_poc.config;

import hamster.dev.fullstack_poc.dto.ChatMessageDTO;
import hamster.dev.fullstack_poc.entity.Message;
import hamster.dev.fullstack_poc.entity.User;
import hamster.dev.fullstack_poc.service.MessageService;
import hamster.dev.fullstack_poc.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
@RequiredArgsConstructor
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    private final ObjectMapper objectMapper;
    private final MessageService messageService;
    private final UserService userService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws IOException {
        sessions.add(session);
        System.out.println("Session added: " + session.getId());
        Collection<Message> lastMessages = messageService.getLastMessages(5);

        for (Message message : lastMessages) {
            ChatMessageDTO chatMessageDTO = ChatMessageDTO.builder()
                    .content(message.getContent())
                    .senderName(message.getSender().getUsername())
                    .senderUuid(message.getSender().getUuid())
                    .build();
            String jsonResponse = objectMapper.writeValueAsString(chatMessageDTO);
            session.sendMessage(new TextMessage(jsonResponse));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
        System.out.println("Session removed: " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        String payload = message.getPayload();
        ChatMessageDTO chatMessageDTO = objectMapper.readValue(payload, ChatMessageDTO.class);

        // Try to save the message if we have sender info
        if (chatMessageDTO.getSenderUuid() != null) {
            Optional<User> sender = userService.findByUuid(chatMessageDTO.getSenderUuid());
            if (sender.isPresent()) {
                messageService.savedMessage(sender.get(), chatMessageDTO.getContent());
                // Update sender name from DB if available
                chatMessageDTO.setSenderName(sender.get().getUsername());
            }
        }

        // Broadcast to all connected sessions
        String jsonResponse = objectMapper.writeValueAsString(chatMessageDTO);
        TextMessage broadcastMessage = new TextMessage(jsonResponse);
        
        for (WebSocketSession s : sessions) {
            if (s.isOpen()) {
                s.sendMessage(broadcastMessage);
            }
        }
    }
}
