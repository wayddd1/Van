package com.example.vanease.VanEase.config;

import com.example.vanease.VanEase.security.filter.JwtAuthFilter;
import com.example.vanease.VanEase.controller.AuthController; // Added controller package import
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    private static final String[] SWAGGER_WHITELIST = {
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/swagger-resources/**",
            "/swagger-ui.html",
            "/webjars/**"
    };

    private static final String[] PUBLIC_ENDPOINTS = {
            "/auth/**",
            "/api/vehicles/all",
            "/api/vehicles/available",
            "/api/vehicles/image/**"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(SWAGGER_WHITELIST).permitAll()
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll()

                        // Vehicle management
                        .requestMatchers(HttpMethod.POST, "/api/vehicles").hasRole("MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/vehicles/**").hasRole("MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/api/vehicles/**").hasRole("MANAGER")
                        .requestMatchers(HttpMethod.POST, "/api/vehicles/**/image").hasRole("MANAGER")

                        // User management
                        .requestMatchers(HttpMethod.GET, "/api/users/**").hasRole("MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/users/**").hasRole("MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("MANAGER")

                        // Booking management
                        .requestMatchers(HttpMethod.POST, "/api/bookings").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.GET, "/api/bookings/user/**").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.GET, "/api/bookings/**").hasAnyRole("MANAGER", "ADMIN", "CUSTOMER")
                        .requestMatchers(HttpMethod.PUT, "/api/bookings/**").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/bookings/**").hasAnyRole("MANAGER", "ADMIN")

                        // Payment management
                        .requestMatchers(HttpMethod.GET, "/api/payments/user/**").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.GET, "/api/payments/**").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/payments").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.PUT, "/api/payments/**").hasAnyRole("MANAGER", "ADMIN")

                        // Admin-only endpoints
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Fallback rule - must be last
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://127.0.0.1:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "X-Requested-With", "Cache-Control"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "X-Total-Count", "Content-Disposition"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}