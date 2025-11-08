package com.chan.project.domain.member.controller;

import com.chan.project.domain.member.dto.response.MemberResponseDto;
import com.chan.project.domain.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/members")
public class MemberController {

    private final MemberService memberService;

    @GetMapping
    public ResponseEntity<List<MemberResponseDto>> getAllMembers() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }
}