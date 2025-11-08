package com.chan.project.domain.chat.entity;

import com.chan.project.global.jpa.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.chan.project.domain.member.entity.Member;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class ChatMember extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id")
    private ChatRoom chatRoom;

    @Enumerated(EnumType.STRING)
    private UserType userType;

    private LocalDateTime lastReadAt;

    public enum UserType {
        ROOM_MEMBER, ROOM_OWNER
    }
}
