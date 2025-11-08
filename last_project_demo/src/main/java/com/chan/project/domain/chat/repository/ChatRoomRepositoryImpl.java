package com.chan.project.domain.chat.repository;

import com.chan.project.domain.chat.entity.ChatRoom;
import com.chan.project.domain.chat.entity.QChatMember;
import com.chan.project.domain.chat.entity.QChatRoom;
import com.chan.project.domain.member.entity.Member;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

@RequiredArgsConstructor
public class ChatRoomRepositoryImpl implements ChatRoomRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Optional<ChatRoom> findDirectRoomByMembers(Member member1, Member member2) {
        QChatRoom chatRoom = QChatRoom.chatRoom;
        QChatMember chatMember1 = new QChatMember("chatMember1");
        QChatMember chatMember2 = new QChatMember("chatMember2");

        ChatRoom result = queryFactory
                .selectFrom(chatRoom)
                .join(chatRoom.members, chatMember1)
                .join(chatRoom.members, chatMember2)
                .where(
                        chatRoom.roomType.eq(ChatRoom.RoomType.DIRECT)
                                .and(chatMember1.member.eq(member1))
                                .and(chatMember2.member.eq(member2))
                )
                .fetchOne();

        return Optional.ofNullable(result);
    }
}
