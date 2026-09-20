package com.civicpulse.backend.repository;

import com.civicpulse.backend.model.Complaint;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends MongoRepository<Complaint, String> {
    List<Complaint> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Complaint> findAllByOrderByCreatedAtDesc();
    
    Optional<Complaint> findByComplaintIdIgnoreCase(String complaintId);

    @Query("{ '$or': [ { '_id': ?0 }, { 'complaintId': { '$regex': ?0, '$options': 'i' } } ] }")
    Optional<Complaint> findByIdOrComplaintId(String identifier);
}
