package courseproject.service;

import courseproject.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import courseproject.repository.ComplaintRepository;

@Service
public class ComplaintService {
    @Autowired
    private ComplaintRepository complaintRepo;

    public ResponseEntity<?> getAllComplaint() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(complaintRepo.findComplaints());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> getAllComplaint(Pageable pageable) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(complaintRepo.findComplaints(pageable));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> getComplaint(String searchQuery, Pageable pageable) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(complaintRepo.findComplaints("%" + searchQuery + "%", pageable));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> getComplaintById(Integer id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(complaintRepo.findComplaintById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> saveComplaint(Complaint complaint) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(complaintRepo.save(complaint));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> deleteComplaint(Integer id) {
        try {
            complaintRepo.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body(id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }
}