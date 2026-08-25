package com.airline.service.impl;

import com.airline.dto.AdminLoginRequest;
import com.airline.dto.AdminLoginResponse;
import com.airline.entity.Admin;
import com.airline.exception.BadRequestException;
import com.airline.exception.ResourceNotFoundException;
import com.airline.repository.AdminRepository;
import com.airline.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;

    @Autowired
    public AdminServiceImpl(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public AdminLoginResponse login(AdminLoginRequest loginRequest) {
        String identifier = loginRequest.getEmail() != null ? loginRequest.getEmail().trim() : "";

        Admin admin = adminRepository.findByEmailIgnoreCaseOrFullNameIgnoreCase(identifier, identifier)
                .orElseThrow(() -> new ResourceNotFoundException("Admin account not found for email/name: " + identifier));

        if (!admin.getPassword().equals(loginRequest.getPassword())) {
            throw new BadRequestException("Invalid email/name or password.");
        }

        return new AdminLoginResponse(admin.getId(), admin.getEmail(), admin.getFullName(), "Login successful");
    }
}
