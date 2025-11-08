package com.chan.project.domain.chat.repository;

import com.chan.project.domain.chat.entity.ChatRoom;
import com.chan.project.domain.member.entity.Member;

import java.util.Optional;

public interface ChatRoomRepositoryCustom {
    Optional<ChatRoom> findDirectRoomByMembers(Member member1, Member member2);
}
