package com.chan.project.domain.member.dto.response;

import java.time.LocalDateTime;

public record PaymentHistoryResponseDTO(
        String paymentKey,
        Long freelancerId,
        Long serviceId,
        String serviceTitle,
        Integer price,
        String memo,
        LocalDateTime approvedAt,
        String serviceImageUrl) {
}
