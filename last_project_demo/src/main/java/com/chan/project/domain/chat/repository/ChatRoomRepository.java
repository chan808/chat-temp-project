package com.chan.project.domain.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.chan.project.domain.chat.entity.ChatRoom;
import com.chan.project.domain.member.entity.Member;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long>, ChatRoomRepositoryCustom {

    @Query("SELECT cr FROM ChatRoom cr JOIN cr.members cm WHERE cm.member = :member")
    List<ChatRoom> findAllByMember(@Param("member") Member member);

}
