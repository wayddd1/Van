package com.example.vanease.VanEase;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.example.vanease.VanEase"})
@EntityScan(basePackages = {"com.example.vanease.VanEase.model"})
@EnableJpaRepositories(basePackages = {"com.example.vanease.VanEase.repository"})
public class VanEaseApplication {
    public static void main(String[] args) {
        SpringApplication.run(VanEaseApplication.class, args);
    }
}
