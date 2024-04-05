package courseproject.springbootbackend.service;

import courseproject.springbootbackend.model.*;
import courseproject.springbootbackend.model.entity.TreatmentEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import courseproject.springbootbackend.repository.TreatmentRepository;

@Service
public class TreatmentService {
    @Autowired
    private TreatmentRepository treatmentRepo;
    
    public ResponseEntity<?> getAllTreatments() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(treatmentRepo.findTreatments());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }
    public ResponseEntity<?> getAllTreatments(Pageable pageable) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(treatmentRepo.findTreatments(pageable));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }
    public ResponseEntity<?> getTreatments(String searchQuery, Pageable pageable) {
        try {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(treatmentRepo.findTreatments("%" + searchQuery + "%", pageable));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> getTreatmentById(Integer id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(treatmentRepo.findTreatmentById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> saveTreatment(TreatmentEntity treatment) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(treatmentRepo.save(treatment));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> deleteTreatment(Integer id) {
        try {
            treatmentRepo.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body(id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }
}   