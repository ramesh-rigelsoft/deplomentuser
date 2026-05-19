package com.rigel.user.security;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityTokenConfig1 {

    @Autowired
    private JwtConfig jwtConfig;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserDetailService userDetailService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            // ❌ CSRF disable (API)
            .csrf(csrf -> csrf.disable())

            // ❌ no session
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // ❌ unauthorized handler
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, e) ->
                    res.sendError(HttpServletResponse.SC_UNAUTHORIZED)))

            // ✅ AUTH RULES
            .authorizeHttpRequests(auth -> auth

                // ✅ PUBLIC APIs
                .requestMatchers(
                	"/api/user/signup",
                    "/api/user/**",
                    "/api/user/login/**",
                    "/authenticate"
                ).permitAll()

                // ✅ STATIC
                .requestMatchers(
                    "/",
                    "/index.html",
                    "/static/**",
                    "/favicon.ico"
                ).permitAll()

                // ✅ SWAGGER / ACTUATOR
                .requestMatchers(
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/actuator/**"
                ).permitAll()

                // ✅ OPTIONS (CORS preflight)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // 🔐 बाकी सब secure
                .anyRequest().authenticated()
            )

            // ✅ JWT FILTER
            .addFilterBefore(
                new JwtTokenAuthenticationFilter(jwtConfig, userDetailService, jwtTokenUtil),
                UsernamePasswordAuthenticationFilter.class
            )

            // ✅ CORS
            .cors(Customizer.withDefaults())

            // ❌ basic auth optional (remove if not needed)
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    // ✅ CORS CONFIG
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000","http://localhost:8091"));
//        config.setAllowedOrigins(Arrays.asList("*"));

        config.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));

        config.setAllowedHeaders(Arrays.asList(
                "Authorization", "Content-Type"
        ));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}