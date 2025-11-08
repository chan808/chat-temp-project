package com.chan.project.domain.member.dto.response;

import com.chan.project.domain.member.entity.Member;
import lombok.Getter;

@Getter
public class MemberResponseDto {
    private Long id;
    private String email;
    private String nickname;

    public MemberResponseDto(Member member) {
        this.id = member.getId();
        this.email = member.getEmail();
        this.nickname = member.getNickname();
    }
}
