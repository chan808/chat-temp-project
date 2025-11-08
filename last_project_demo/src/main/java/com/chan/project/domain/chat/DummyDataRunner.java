//package com.chan.project.domain.chat;
//
//import com.chan.project.domain.member.entity.Member;
//import com.chan.project.domain.member.entity.MemberRole;
//import com.chan.project.domain.member.repository.MemberRepository;
//import lombok.RequiredArgsConstructor;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Component;
//import org.springframework.transaction.annotation.Transactional;
//
//@Component
//@RequiredArgsConstructor
//public class DummyDataRunner implements CommandLineRunner {
//
//    private final MemberRepository memberRepository;
//    private final PasswordEncoder passwordEncoder;
//    private static final Logger logger = LoggerFactory.getLogger(DummyDataRunner.class);
//
//    @Override
//    @Transactional
//    public void run(String... args) throws Exception {
//        // Find and delete existing test users to ensure data is fresh
//        for (int i = 1; i <= 5; i++) {
//            memberRepository.findByEmail("test" + i + "@test.com").ifPresent(memberRepository::delete);
//        }
//
//        // Create new test users with encoded passwords
//        logger.info("Creating dummy users...");
//        for (int i = 1; i <= 5; i++) {
//            String rawPassword = "test1234";
//            String encodedPassword = passwordEncoder.encode(rawPassword);
//
//            logger.info("Creating user '{}' with encoded password: {}", "test" + i + "@test.com", encodedPassword);
//
//            Member member = Member.builder()
//                    .email("test" + i + "@test.com")
//                    .password(encodedPassword)
//                    .nickname("user" + i)
//                    .memberRole(MemberRole.USER)
//                    .build();
//            memberRepository.save(member);
//        }
//        logger.info("Dummy users created.");
//    }
//}
