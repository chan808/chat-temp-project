package com.chan.project.domain.chat.dto;

import jakarta.validation.constraints.NotBlank;

public record CreatePublicChatReq(
        @NotBlank
        String roomName
) {
}
