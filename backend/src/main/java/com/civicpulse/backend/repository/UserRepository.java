package com.civicpulse.backend.repository;

import com.civicpulse.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByOfficerIdAndRole(String officerId, String role);
    boolean existsByEmail(String email);
}
