package com.airline.dto;

import com.airline.entity.enums.Role;

public class AuthResponse {
    private Long id;
    private String email;
    private String fullName;
    private Role role;
    private String message;

    public AuthResponse(Long id, String email, String fullName, Role role, String message) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.message = message;
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
    public Role getRole() { return role; }
    public String getMessage() { return message; }
}
