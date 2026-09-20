package com.civicpulse.backend.controller;

import com.civicpulse.backend.dto.AuthResponse;
import com.civicpulse.backend.dto.LoginRequest;
import com.civicpulse.backend.dto.RegisterRequest;
import com.civicpulse.backend.model.User;
import com.civicpulse.backend.repository.UserRepository;
import com.civicpulse.backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        if (!StringUtils.hasText(request.getName()) ||
            !StringUtils.hasText(request.getEmail()) ||
            !StringUtils.hasText(request.getPhone()) ||
            !StringUtils.hasText(request.getPassword())) {
            
            Map<String, String> err = new HashMap<>();
            err.put("error", "All fields (name, email, phone, password) are required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "User with this email already exists.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        }

        User newUser = new User();
        newUser.setName(request.getName());
        newUser.setEmail(request.getEmail());
        newUser.setPhone(request.getPhone());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole("user");

        userRepository.save(newUser);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Registration successful.");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        String role = request.getRole();
        User user = null;

        if ("admin".equalsIgnoreCase(role)) {
            if (!StringUtils.hasText(request.getOfficerId()) || !StringUtils.hasText(request.getPassword())) {
                Map<String, String> err = new HashMap<>();
                err.put("error", "Officer ID and password/PIN are required.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
            }

            Optional<User> adminOpt = userRepository.findByOfficerIdAndRole(request.getOfficerId(), "admin");
            if (adminOpt.isPresent()) {
                user = adminOpt.get();
            } else {
                // Auto-seed admin user if login attempt is made and admin does not exist yet
                user = new User();
                user.setName("Officer " + request.getOfficerId());
                user.setOfficerId(request.getOfficerId());
                user.setDepartment(StringUtils.hasText(request.getDepartment()) ? request.getDepartment() : "General");
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                user.setRole("admin");
                user = userRepository.save(user);
            }
        } else {
            // Citizen login
            if (!StringUtils.hasText(request.getEmail()) || !StringUtils.hasText(request.getPassword())) {
                Map<String, String> err = new HashMap<>();
                err.put("error", "Email and password are required.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
            }

            Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
            if (userOpt.isPresent() && "user".equalsIgnoreCase(userOpt.get().getRole())) {
                user = userOpt.get();
            }
        }

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Invalid login credentials.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        }

        String token = jwtTokenProvider.generateToken(
                user.getId(),
                user.getName(),
                user.getRole(),
                user.getEmail(),
                user.getOfficerId(),
                user.getDepartment()
        );

        AuthResponse.UserDto userDto = new AuthResponse.UserDto(
                user.getId(),
                user.getName(),
                user.getRole(),
                user.getEmail(),
                user.getOfficerId(),
                user.getDepartment()
        );

        return ResponseEntity.ok(new AuthResponse(token, userDto));
    }
}
