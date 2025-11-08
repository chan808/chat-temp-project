package com.chan.project.domain.chat.dto;

import jakarta.validation.constraints.NotNull;

public record CreateDirectChatReq(
        @NotNull
        Long partnerId
) {
}
