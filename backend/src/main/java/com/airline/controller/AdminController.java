package com.airline.controller;

import com.airline.dto.AdminLoginRequest;
import com.airline.dto.AdminLoginResponse;
import com.airline.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponse> login(@RequestBody AdminLoginRequest loginRequest) {
        AdminLoginResponse response = adminService.login(loginRequest);
        return ResponseEntity.ok(response);
    }
}
