package com.civicpulse.backend.config;

import com.civicpulse.backend.model.Complaint;
import com.civicpulse.backend.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final ComplaintRepository complaintRepository;

    @Autowired
    public DataLoader(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (complaintRepository.count() == 0) {
            complaintRepository.save(new Complaint(
                "CP-1001",
                "CIT-8041",
                "Major Water Pipeline Leakage",
                "Clean drinking water is leaking rapidly on Main Market Road, causing road erosion.",
                "Water Supply",
                "Sector 12, Near Central Market, Ward 4",
                "2026-08-20",
                "pending",
                "Water Supply & Sanitation Department",
                "Unassigned"
            ));

            complaintRepository.save(new Complaint(
                "CP-1002",
                "CIT-9102",
                "Hazardous Pothole on Highway Junction",
                "A dangerous 3-foot wide pothole causing severe traffic congestion and minor accidents.",
                "Roads & Infrastructure",
                "Outer Ring Road, Ward 9 Junction",
                "2026-08-21",
                "in-progress",
                "Roads & Traffic Engineering Dept",
                "Eng. R. K. Varma (Junior Engineer)"
            ));

            complaintRepository.save(new Complaint(
                "CP-1003",
                "CIT-7452",
                "High Voltage Streetlight Outage",
                "Complete blackout of 12 streetlights across Block B for the last 3 days.",
                "Electricity",
                "Block B, Residential Colony, Ward 14",
                "2026-08-22",
                "in-progress",
                "Electrical Works Department",
                "Officer Suresh Nair (Chief Lineman)"
            ));

            complaintRepository.save(new Complaint(
                "CP-1004",
                "CIT-6321",
                "Overflowing Community Waste Dump",
                "Garbage bin has not been cleared for 4 days, causing foul smell and health hazard.",
                "Sanitation",
                "Green Park Gate 2, Ward 3",
                "2026-08-23",
                "resolved",
                "Municipal Solid Waste Division",
                "Inspector M. P. Singh"
            ));

            complaintRepository.save(new Complaint(
                "CP-1005",
                "CIT-5110",
                "Private Wall Painting Query",
                "Complaint regarding private residential wall color scheme.",
                "Others",
                "Private Society Complex, Ward 1",
                "2026-08-24",
                "pending",
                "Civic Grievance Review Cell",
                "N/A (Outside Municipal Jurisdiction)"
            ));

            System.out.println(">>> CivicPulse Sample Demo Complaints (CP-1001 to CP-1005) Successfully Seeded!");
        }
    }
}
