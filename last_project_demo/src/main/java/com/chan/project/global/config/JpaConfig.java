package com.chan.project.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.MongoRepository;

@Configuration
@EnableJpaRepositories(
    basePackages = "com.chan.project.domain",
    excludeFilters = @org.springframework.context.annotation.ComponentScan.Filter(
        type = org.springframework.context.annotation.FilterType.ASSIGNABLE_TYPE,
        classes = MongoRepository.class
    )
)
public class JpaConfig {
}
