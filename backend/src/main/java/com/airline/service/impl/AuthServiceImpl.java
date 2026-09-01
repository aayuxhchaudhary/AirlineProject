package com.airline.service.impl;

import com.airline.dto.AuthResponse;
import com.airline.dto.LoginRequest;
import com.airline.dto.SignupRequest;
import com.airline.entity.User;
import com.airline.entity.enums.Role;
import com.airline.exception.BadRequestException;
import com.airline.repository.UserRepository;
import com.airline.service.AuthService;
import com.airline.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");

    private final UserRepository userRepository;
    private final MessageService msg;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    public AuthServiceImpl(UserRepository userRepository, MessageService messageService) {
        this.userRepository = userRepository;
        this.msg = messageService;
    }

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) return "";
        String trimmed = email.trim().toLowerCase();
        String[] parts = trimmed.split("@");
        if (parts.length != 2) return trimmed;

        String localPart = parts[0];
        String domain = parts[1];

        if ("gmail.com".equals(domain) || "googlemail.com".equals(domain)) {
            String cleanedLocal = localPart.split("\\+")[0].replace(".", "");
            return cleanedLocal + "@gmail.com";
        }
        return trimmed;
    }

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        if (loginRequest.getEmail() == null || !EMAIL_PATTERN.matcher(loginRequest.getEmail().trim()).matches()) {
            throw new BadRequestException(msg.get("app.messages.auth.invalid-email"));
        }
        if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
            throw new BadRequestException(msg.get("app.messages.auth.empty-password"));
        }

        String identifier = normalizeEmail(loginRequest.getEmail());
        User user = userRepository.findByEmailIgnoreCase(identifier)
                .orElseThrow(() -> new BadRequestException(msg.get("app.messages.auth.invalid-credentials")));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new BadRequestException(msg.get("app.messages.auth.invalid-credentials"));
        }

        return new AuthResponse(user.getId(), user.getEmail(), user.getFullName(), user.getRole(), msg.get("app.messages.auth.login-success"));
    }

    @Override
    public AuthResponse signup(SignupRequest signupRequest) {
        if (signupRequest.getFullName() == null || signupRequest.getFullName().trim().length() < 2) {
            throw new BadRequestException(msg.get("app.messages.auth.short-name"));
        }
        if (signupRequest.getEmail() == null || !EMAIL_PATTERN.matcher(signupRequest.getEmail().trim()).matches()) {
            throw new BadRequestException(msg.get("app.messages.auth.invalid-email"));
        }
        if (signupRequest.getPassword() == null || signupRequest.getPassword().length() < 6) {
            throw new BadRequestException(msg.get("app.messages.auth.short-password"));
        }

        String email = normalizeEmail(signupRequest.getEmail());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new BadRequestException(msg.get("app.messages.auth.email-registered"));
        }

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        newUser.setFullName(signupRequest.getFullName().trim());
        newUser.setRole(Role.USER);

        User savedUser = userRepository.save(newUser);
        return new AuthResponse(savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), savedUser.getRole(), msg.get("app.messages.auth.signup-success"));
    }
}
