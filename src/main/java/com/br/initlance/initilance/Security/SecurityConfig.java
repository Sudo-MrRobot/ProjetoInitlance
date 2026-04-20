package com.br.initlance.initilance.Security;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
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
                    "/freelancers/**",
                    "/empresas/**"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login/sing-up")
                .loginProcessingUrl("/login")
                .usernameParameter("email")
                .passwordParameter("senha")
                .permitAll()
            )
            .oauth2Login(oauth -> oauth
                .loginPage("/login/sing-up")
                .defaultSuccessUrl("/empresas/dashboard", true)
            );

        return http.build();
    }
}
