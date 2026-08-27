package com.airline.service;

import com.airline.dto.AuthResponse;
import com.airline.dto.LoginRequest;
import com.airline.dto.SignupRequest;

public interface AuthService {
    AuthResponse login(LoginRequest loginRequest);
    AuthResponse signup(SignupRequest signupRequest);
}
