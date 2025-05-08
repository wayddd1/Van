package com.example.vanease.VanEase.config;

import com.example.vanease.VanEase.security.filter.JwtAuthFilter;
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
// No additional imports needed

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
            "/auth/login",
            "/auth/register",
            "/auth/refresh",
            "/api/auth/**",
            "/api/auth/login",
            "/api/auth/register",
            "/api/auth/refresh",
            "/api/vehicles/all",
            "/api/vehicles/available",
            "/api/vehicles/{id}",
            "/api/vehicles/*/image",
            "/api/vehicles/image/**",
            "/api/vehicles/**",
            "/api/vehicles/[0-9]+",
            "/api/vehicles/[0-9]+/image",
            "/api/vehicles/[0-9]+/availability",
            "/api/bookings/create",
            "/api/bookings",
            "/api/payments/create",
            "/api/payments"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Configure CORS first - use the CorsFilter bean from CorsConfig
                .cors(cors -> {})
                // Disable CSRF for REST APIs
                .csrf(AbstractHttpConfigurer::disable)
                // Use stateless session management
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // OPTIONS requests should always be allowed for CORS preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Authentication endpoints - using the correct paths
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/auth/refresh").permitAll()
                        .requestMatchers("/auth/login").permitAll()
                        .requestMatchers("/auth/register").permitAll()
                        // Swagger/OpenAPI documentation
                        .requestMatchers(SWAGGER_WHITELIST).permitAll()
                        // Other public endpoints
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                        
                        // Make all GET vehicle endpoints public
                        .requestMatchers(HttpMethod.GET, "/api/vehicles/**").permitAll()

                        // Vehicle management (non-GET operations)
                        .requestMatchers(HttpMethod.POST, "/api/vehicles/**").hasRole("MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/vehicles/**").hasRole("MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/api/vehicles/**").hasRole("MANAGER")

                        // User management
                        .requestMatchers(HttpMethod.GET, "/api/users/profile").hasAnyRole("CUSTOMER", "MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/users/**").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/users/**").hasAnyRole("CUSTOMER", "MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("MANAGER")

                        // Booking management - make create endpoints public for testing
                        .requestMatchers(HttpMethod.POST, "/api/bookings").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/bookings/create").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/bookings/user/upcoming").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.GET, "/api/bookings/user/past").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.GET, "/api/bookings/user/{id}").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.GET, "/api/bookings/user/**").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.GET, "/api/bookings/**").hasAnyRole("MANAGER", "ADMIN", "CUSTOMER")
                        .requestMatchers(HttpMethod.PUT, "/api/bookings/**").hasAnyRole("MANAGER", "ADMIN", "CUSTOMER")
                        .requestMatchers(HttpMethod.PATCH, "/api/bookings/**").hasAnyRole("MANAGER", "ADMIN", "CUSTOMER")
                        .requestMatchers(HttpMethod.DELETE, "/api/bookings/**").hasAnyRole("CUSTOMER", "MANAGER", "ADMIN")

                        // Payment management - make create endpoints public for testing
                        .requestMatchers(HttpMethod.POST, "/api/payments/create").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/payments").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/payments/booking/**").hasAnyRole("CUSTOMER", "MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/payments/method/**").hasAnyRole("MANAGER", "ADMIN", "CUSTOMER")
                        .requestMatchers(HttpMethod.GET, "/api/payments/status/**").hasAnyRole("MANAGER", "ADMIN", "CUSTOMER")
                        .requestMatchers(HttpMethod.PATCH, "/api/payments/**/status").hasAnyRole("MANAGER", "ADMIN", "CUSTOMER")

                        // Admin-only endpoints
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Fallback rule - must be last
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // We're using CorsFilter bean from CorsConfig instead of this method
}