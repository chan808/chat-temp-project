package com.chan.project.domain.member.service;

import com.chan.project.domain.member.entity.Member;
import com.chan.project.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.chan.project.domain.member.dto.AuthTokensDTO;
import com.chan.project.domain.member.dto.request.LoginRequestDTO;
import com.chan.project.domain.member.exception.LoginException;
import com.chan.project.domain.member.exception.RefreshTokenException;
import com.chan.project.global.redis.RedisRepository;
import com.chan.project.global.security.CustomUserDetails;
import com.chan.project.global.security.jwt.JwtContents;
import com.chan.project.global.security.jwt.JwtUtil;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtUtil jwtUtil;
    private final RedisRepository redisRepository;
    private final AuthenticationManager authenticationManager;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);


    public String reissueAccessToken(String refreshToken) {
        validateRefreshToken(refreshToken);
        return jwtUtil.createJwt(JwtContents.TOKEN_TYPE_ACCESS,
                jwtUtil.getEmail(refreshToken),
                jwtUtil.getRole(refreshToken),
                jwtUtil.getMemberId(refreshToken),
                JwtContents.ACCESS_TOKEN_EXPIRE_MILLIS);
    }

    public String reissueRefreshToken(String oldRefreshToken) {
        validateRefreshToken(oldRefreshToken);

        redisRepository.deleteValue(oldRefreshToken);

        String newRefreshToken = jwtUtil.createJwt(JwtContents.TOKEN_TYPE_REFRESH,
                jwtUtil.getEmail(oldRefreshToken),
                jwtUtil.getRole(oldRefreshToken),
                jwtUtil.getMemberId(oldRefreshToken),
                JwtContents.REFRESH_TOKEN_EXPIRE_MILLIS);

        redisRepository.setValue(newRefreshToken, "valid", Duration.ofSeconds(JwtContents.REFRESH_TOKEN_EXPIRE_SECONDS));

        return newRefreshToken;
    }

    public AuthTokensDTO login(LoginRequestDTO request) {
        logger.info("Login attempt for email: {}", request.getEmail());
        logger.info("Plain password: {}", request.getPassword());
        logger.info("Encoded password (new hash created each time): {}", passwordEncoder.encode(request.getPassword()));

        // --- ADDED FOR DEMONSTRATION ---
        memberRepository.findByEmail(request.getEmail()).ifPresent(member -> {
            String storedPassword = member.getPassword();
            boolean isMatch = passwordEncoder.matches(request.getPassword(), storedPassword);
            logger.info("Stored hash from DB: {}", storedPassword);
            logger.info("Does plain password match stored hash? ---> {}", isMatch);
        });
        // --- END OF DEMONSTRATION ---

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail().trim(), request.getPassword().trim())
            );

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            String email = userDetails.getEmail();
            String role = userDetails.getAuthorities().iterator().next().getAuthority().replaceFirst("^ROLE_", "");
            Long memberId = userDetails.getMemberId();

            String accessToken = jwtUtil.createJwt(JwtContents.TOKEN_TYPE_ACCESS, email, role, memberId, JwtContents.ACCESS_TOKEN_EXPIRE_MILLIS);
            String refreshToken = jwtUtil.createJwt(JwtContents.TOKEN_TYPE_REFRESH, email, role, memberId, JwtContents.REFRESH_TOKEN_EXPIRE_MILLIS);

            redisRepository.setValue(refreshToken, "valid", Duration.ofSeconds(JwtContents.REFRESH_TOKEN_EXPIRE_SECONDS));

            return new AuthTokensDTO(accessToken, refreshToken);

        } catch (Exception e) {
            logger.error("Authentication failed!", e);
            throw new LoginException("이메일 또는 비밀번호가 잘못되었습니다.");
        }
    }

    public AuthTokensDTO devLogin(String email) {
        Member member = memberRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Dev login user not found: " + email));

        String role = member.getMemberRole().name();
        Long memberId = member.getId();

        String accessToken = jwtUtil.createJwt(JwtContents.TOKEN_TYPE_ACCESS, email, role, memberId, JwtContents.ACCESS_TOKEN_EXPIRE_MILLIS);
        String refreshToken = jwtUtil.createJwt(JwtContents.TOKEN_TYPE_REFRESH, email, role, memberId, JwtContents.REFRESH_TOKEN_EXPIRE_MILLIS);

        redisRepository.setValue(refreshToken, "valid", Duration.ofSeconds(JwtContents.REFRESH_TOKEN_EXPIRE_SECONDS));

        logger.info("--- DEV LOGIN SUCCESS ---");
        logger.info("Tokens generated for user: {}", email);

        return new AuthTokensDTO(accessToken, refreshToken);
    }

    public void logout(String refreshToken) {
        if (refreshToken != null) {
            redisRepository.deleteValue(refreshToken);
        }
    }

    private void validateRefreshToken(String refreshToken) {
        if (refreshToken == null) {
            throw new RefreshTokenException("토큰이 존재하지 않습니다.");
        }

        try {
            if (jwtUtil.isExpired(refreshToken) ||
                    !jwtUtil.getType(refreshToken).equals(JwtContents.TOKEN_TYPE_REFRESH) ||
                    redisRepository.getValue(refreshToken) == null) {
                throw new RefreshTokenException("토큰이 유효하지 않습니다.");
            }
        } catch (Exception e) {
            throw new RefreshTokenException("토큰이 유효하지 않습니다.");
        }
    }
}
