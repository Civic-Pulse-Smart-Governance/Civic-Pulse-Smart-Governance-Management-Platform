package com.civicpulse.backend.controller;

import com.civicpulse.backend.dto.ComplaintRequest;
import com.civicpulse.backend.dto.StatusUpdateRequest;
import com.civicpulse.backend.model.Complaint;
import com.civicpulse.backend.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;

    @GetMapping("/{id}")
    public ResponseEntity<?> getComplaintById(@PathVariable("id") String id) {
        if (!StringUtils.hasText(id)) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Complaint ID cannot be empty.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        }

        Optional<Complaint> complaintOpt = complaintRepository.findByComplaintIdIgnoreCase(id.trim());
        if (!complaintOpt.isPresent()) {
            complaintOpt = complaintRepository.findById(id.trim());
        }

        if (complaintOpt.isPresent()) {
            return ResponseEntity.ok(complaintOpt.get());
        } else {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Complaint not found. Please check the Complaint ID and try again.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
        }
    }

    @PostMapping
    public ResponseEntity<?> createComplaint(@RequestBody ComplaintRequest request) {
        if (!StringUtils.hasText(request.getCategory()) || !StringUtils.hasText(request.getDescription())) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Category and description are required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        }

        String userId = "GUEST";
        String userName = "Anonymous Citizen";

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> principal = (Map<String, Object>) auth.getPrincipal();
            if (principal.get("id") != null) userId = (String) principal.get("id");
            if (principal.get("name") != null) userName = (String) principal.get("name");
        }

        Complaint complaint = new Complaint();
        String title = StringUtils.hasText(request.getTitle()) 
                ? request.getTitle() 
                : request.getCategory().toUpperCase() + " Issue";

        // Generate unique tracking Complaint ID (e.g. CP-4821)
        int randomNum = 1000 + new Random().nextInt(9000);
        String generatedComplaintId = "CP-" + randomNum;
        
        complaint.setComplaintId(generatedComplaintId);
        complaint.setCitizenId("CIT-" + (1000 + new Random().nextInt(9000)));
        complaint.setTitle(title);
        complaint.setCategory(request.getCategory());
        complaint.setDescription(request.getDescription());
        complaint.setLocation(StringUtils.hasText(request.getLocation()) ? request.getLocation() : "Not Specified");
        complaint.setUrgency(StringUtils.hasText(request.getUrgency()) ? request.getUrgency() : "Medium");
        complaint.setStatus("pending");
        complaint.setSubmittedDate(LocalDate.now().toString());
        complaint.setDepartment(getDepartmentByCategory(request.getCategory()));
        complaint.setAssignedOfficer("Unassigned (Pending Routing)");
        complaint.setUserId(userId);
        complaint.setUserName(userName);

        Complaint savedComplaint = complaintRepository.save(complaint);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("complaint", savedComplaint);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<?> getComplaints() {
        String role = "user";
        String userId = "";

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> principal = (Map<String, Object>) auth.getPrincipal();
            if (principal.get("role") != null) role = (String) principal.get("role");
            if (principal.get("id") != null) userId = (String) principal.get("id");
        }

        List<Complaint> complaints;
        if ("admin".equalsIgnoreCase(role)) {
            complaints = complaintRepository.findAllByOrderByCreatedAtDesc();
        } else {
            complaints = complaintRepository.findByUserIdOrderByCreatedAtDesc(userId);
            if (complaints.isEmpty()) {
                complaints = complaintRepository.findAllByOrderByCreatedAtDesc();
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("complaints", complaints);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateComplaintStatus(@PathVariable("id") String id,
                                                   @RequestBody StatusUpdateRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> principal = (Map<String, Object>) auth.getPrincipal();
            String role = (String) principal.get("role");
            if (!"admin".equalsIgnoreCase(role)) {
                Map<String, String> err = new HashMap<>();
                err.put("error", "Admin access required.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(err);
            }
        }

        String status = request.getStatus();
        List<String> validStatuses = Arrays.asList("pending", "in-progress", "resolved", "assigned", "rejected");
        if (!validStatuses.contains(status.toLowerCase())) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Invalid status value.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        }

        Optional<Complaint> complaintOpt = complaintRepository.findByComplaintIdIgnoreCase(id);
        if (!complaintOpt.isPresent()) {
            complaintOpt = complaintRepository.findById(id);
        }

        if (!complaintOpt.isPresent()) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Complaint not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
        }

        Complaint complaint = complaintOpt.get();
        complaint.setStatus(status.toLowerCase());
        complaintRepository.save(complaint);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("complaint", complaint);

        return ResponseEntity.ok(response);
    }

    private String getDepartmentByCategory(String category) {
        if (category == null) return "General Municipal Services";
        String catLower = category.toLowerCase();
        if (catLower.contains("road")) {
            return "Roads & Traffic Engineering Dept";
        } else if (catLower.contains("water")) {
            return "Water Supply & Sanitation Department";
        } else if (catLower.contains("electr")) {
            return "Electrical Works Department";
        } else if (catLower.contains("sanitat") || catLower.contains("garb")) {
            return "Municipal Solid Waste Division";
        } else {
            return "General Civic Grievances Dept";
        }
    }
}
