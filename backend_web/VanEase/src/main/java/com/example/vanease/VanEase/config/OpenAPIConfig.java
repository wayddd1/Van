package com.example.vanease.VanEase.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI vanEaseOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:8080");
        devServer.setDescription("Development Server");

        Server prodServer = new Server();
        prodServer.setUrl("https://api.vanease.com");
        prodServer.setDescription("Production Server");

        Contact contact = new Contact();
        contact.setName("VanEase Support");
        contact.setEmail("support@vanease.com");
        contact.setUrl("https://www.vanease.com/contact");

        License mitLicense = new License()
                .name("MIT License")
                .url("https://opensource.org/licenses/MIT");

        Info info = new Info()
                .title("VanEase API Documentation")
                .version("1.0")
                .contact(contact)
                .description("API for VanEase Van Rental Management System")
                .termsOfService("https://www.vanease.com/terms")
                .license(mitLicense);

        return new OpenAPI()
                .info(info)
                .servers(List.of(devServer, prodServer));
    }
}