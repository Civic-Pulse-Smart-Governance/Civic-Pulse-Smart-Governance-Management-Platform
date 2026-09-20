package com.civicpulse.backend.dto;

public class AuthResponse {
    private String token;
    private UserDto user;

    public AuthResponse(String token, UserDto user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public static class UserDto {
        private String id;
        private String name;
        private String role;
        private String email;
        private String officerId;
        private String department;

        public UserDto(String id, String name, String role, String email, String officerId, String department) {
            this.id = id;
            this.name = name;
            this.role = role;
            this.email = email;
            this.officerId = officerId;
            this.department = department;
        }

        public String getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public String getRole() {
            return role;
        }

        public String getEmail() {
            return email;
        }

        public String getOfficerId() {
            return officerId;
        }

        public String getDepartment() {
            return department;
        }
    }
}
