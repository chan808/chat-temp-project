package com.chan.project.domain.chat.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.chan.project.domain.chat.entity.ChatMessage;

import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByChatRoomIdOrderByCreatedAtAsc(Long chatRoomId);
    }