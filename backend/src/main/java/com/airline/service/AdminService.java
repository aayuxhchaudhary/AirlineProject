package com.airline.service;

import com.airline.dto.AdminLoginRequest;
import com.airline.dto.AdminLoginResponse;

public interface AdminService {

    AdminLoginResponse login(AdminLoginRequest loginRequest);
}
