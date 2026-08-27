package com.airline.service.impl;

import com.airline.dto.AuthResponse;
import com.airline.dto.LoginRequest;
import com.airline.dto.SignupRequest;
import com.airline.entity.User;
import com.airline.entity.enums.Role;
import com.airline.exception.BadRequestException;
import com.airline.repository.UserRepository;
import com.airline.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    public AuthServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
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
        String identifier = normalizeEmail(loginRequest.getEmail());

        User user = userRepository.findByEmailIgnoreCase(identifier)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password."));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }

        return new AuthResponse(user.getId(), user.getEmail(), user.getFullName(), user.getRole(), "Login successful");
    }

    @Override
    public AuthResponse signup(SignupRequest signupRequest) {
        String email = normalizeEmail(signupRequest.getEmail());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new BadRequestException("Email is already registered.");
        }

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        newUser.setFullName(signupRequest.getFullName().trim());
        newUser.setRole(Role.USER);

        User savedUser = userRepository.save(newUser);
        return new AuthResponse(savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), savedUser.getRole(), "Signup successful");
    }
}
