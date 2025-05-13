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
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
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
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:5173",
            "http://127.0.0.1:5173"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"));
        configuration.setExposedHeaders(Arrays.asList(
            "Access-Control-Allow-Origin", 
            "Access-Control-Allow-Credentials",
            "Access-Control-Allow-Headers",
            "Access-Control-Allow-Methods",
            "Authorization",
            "Content-Type",
            "Cache-Control",
            "Pragma"
        ));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            // Configure CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Disable CSRF for REST APIs
            .csrf(AbstractHttpConfigurer::disable)
            
            // Use stateless session management
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Configure authorization rules
            .authorizeHttpRequests(auth -> {
                // OPTIONS requests should always be allowed for CORS preflight
                auth.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll();
                
                // Authentication endpoints
                auth.requestMatchers("/auth/**").permitAll();
                auth.requestMatchers("/auth/login").permitAll();
                auth.requestMatchers("/auth/register").permitAll();
                auth.requestMatchers("/auth/refresh").permitAll();
                
                // Swagger/OpenAPI documentation
                auth.requestMatchers(SWAGGER_WHITELIST).permitAll();
                
                // Other public endpoints
                auth.requestMatchers(PUBLIC_ENDPOINTS).permitAll();
                
                // Make all GET vehicle endpoints public
                auth.requestMatchers(HttpMethod.GET, "/api/vehicles/**").permitAll();

                // Vehicle management (non-GET operations)
                auth.requestMatchers(HttpMethod.POST, "/api/vehicles/**").hasRole("MANAGER");
                auth.requestMatchers(HttpMethod.PUT, "/api/vehicles/**").hasRole("MANAGER");
                auth.requestMatchers(HttpMethod.DELETE, "/api/vehicles/**").hasRole("MANAGER");

                // User management
                auth.requestMatchers(HttpMethod.GET, "/api/users/profile").hasAnyRole("CUSTOMER", "MANAGER", "ADMIN");
                auth.requestMatchers(HttpMethod.GET, "/api/users/all").hasAnyRole("MANAGER", "ADMIN");
                auth.requestMatchers(HttpMethod.GET, "/api/users/**").hasAnyRole("MANAGER", "ADMIN");
                auth.requestMatchers(HttpMethod.PUT, "/api/users/**").hasAnyRole("CUSTOMER", "MANAGER", "ADMIN");
                auth.requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("MANAGER");

                // Booking management - make create endpoints public for testing
                auth.requestMatchers(HttpMethod.POST, "/api/bookings").permitAll();
                auth.requestMatchers(HttpMethod.POST, "/api/bookings/create").permitAll();
                auth.requestMatchers(HttpMethod.GET, "/api/bookings").hasAnyRole("MANAGER", "ADMIN"); // Explicitly allow MANAGER to access all bookings
                auth.requestMatchers(HttpMethod.GET, "/api/bookings/user/upcoming").hasRole("CUSTOMER");
                auth.requestMatchers(HttpMethod.GET, "/api/bookings/user/past").hasRole("CUSTOMER");
                auth.requestMatchers(HttpMethod.GET, "/api/bookings/user/{id}").hasRole("CUSTOMER");
                auth.requestMatchers(HttpMethod.GET, "/api/bookings/user/**").hasRole("CUSTOMER");
                auth.requestMatchers(HttpMethod.GET, "/api/bookings/**").hasAnyRole("MANAGER", "ADMIN", "CUSTOMER");
                auth.requestMatchers(HttpMethod.PUT, "/api/bookings/**").hasAnyRole("MANAGER", "ADMIN", "CUSTOMER");
                auth.requestMatchers(HttpMethod.PATCH, "/api/bookings/**").hasAnyRole("MANAGER", "ADMIN", "CUSTOMER");
                auth.requestMatchers(HttpMethod.DELETE, "/api/bookings/**").hasAnyRole("CUSTOMER", "MANAGER", "ADMIN");

                // Payment management - make create endpoints public for testing
                auth.requestMatchers(HttpMethod.POST, "/api/payments/create").permitAll();
                auth.requestMatchers(HttpMethod.POST, "/api/payments").permitAll();
                auth.requestMatchers(HttpMethod.GET, "/api/payments/booking/**").hasAnyRole("CUSTOMER", "MANAGER", "ADMIN");
                auth.requestMatchers(HttpMethod.GET, "/api/payments/method/**").hasAnyRole("MANAGER", "ADMIN", "CUSTOMER");
                auth.requestMatchers(HttpMethod.GET, "/api/payments/status/**").hasAnyRole("MANAGER", "ADMIN", "CUSTOMER");
                auth.requestMatchers(HttpMethod.PATCH, "/api/payments/**/status").hasAnyRole("MANAGER", "ADMIN", "CUSTOMER");

                // Admin-only endpoints
                auth.requestMatchers("/api/admin/**").hasRole("ADMIN");

                // Fallback rule - must be last
                auth.anyRequest().authenticated();
            })
            
            // Add JWT filter and authentication provider
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            
            .build();
    }
}