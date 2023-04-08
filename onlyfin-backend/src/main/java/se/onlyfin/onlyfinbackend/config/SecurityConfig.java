package se.onlyfin.onlyfinbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import se.onlyfin.onlyfinbackend.service.OnlyfinUserDetailsService;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    private final OnlyfinUserDetailsService onlyfinUserDetailsService;

    public SecurityConfig(OnlyfinUserDetailsService onlyfinUserDetailsService) {
        this.onlyfinUserDetailsService = onlyfinUserDetailsService;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers(
                                "/user",
                                "/search-all",
                                "/get-analyst-by-name",
                                "/search-analyst",
                                "/subscribe",
                                "/unsubscribe",
                                "/enable-analyst",
                                "/disable-analyst")
                        .hasRole("USER")
                        .requestMatchers(
                                "/",
                                "/register",
                                "/assets/**")
                        .permitAll()
                )
                .formLogin();
        return http.build();
    }

    @Bean
    public WebSecurityCustomizer ignoringCustomizer() {
        //DISABLE AUTH GLOBALLY
        return (web) -> web.ignoring().requestMatchers("/**");

    }


    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
