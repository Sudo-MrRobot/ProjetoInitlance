package com.br.initlance.initilance.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
            UserDetailsService userDetailsService,
            AuthenticationSuccessHandlerImpl authenticationSuccessHandler,
            CustomOAuth2UserService customOAuth2UserService) throws Exception {
        http
            .userDetailsService(userDetailsService)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/",
                    "/login",
                    "/login/**",
                    "/oauth2/**",
                    "/CSS/**",
                    "/js/**",
                    "/IMG/**",
                    "/usuarios/**",
                    "/freelancers/cadastrar",
                    "/freelancers/salvar",
                    "/empresas/cadastrar",
                    "/empresas/salvar"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login/sing-up")
                .loginProcessingUrl("/login")
                .usernameParameter("email")
                .passwordParameter("senha")
                .successHandler(authenticationSuccessHandler)
                .failureUrl("/login/sing-up?erro")
                .permitAll()
            )
            .oauth2Login(oauth -> oauth
                .loginPage("/login/sing-up")
                .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
                .successHandler(authenticationSuccessHandler)
            );

        return http.build();
    }
}
