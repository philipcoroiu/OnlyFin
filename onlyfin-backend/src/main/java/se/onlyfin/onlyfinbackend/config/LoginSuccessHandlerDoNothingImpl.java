package se.onlyfin.onlyfinbackend.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;

public class LoginSuccessHandlerDoNothingImpl implements org.springframework.security.web.authentication.AuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        //this implementation does nothing on successful logins - it lets the caller handle it instead
    }
}
