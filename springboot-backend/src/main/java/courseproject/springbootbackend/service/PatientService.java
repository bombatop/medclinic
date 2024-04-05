package courseproject.springbootbackend.service;

import courseproject.springbootbackend.model.entity.PatientEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import courseproject.springbootbackend.repository.PatientRepository;

@Service
public class PatientService {
    @Autowired
    private PatientRepository repo;

    public ResponseEntity<?> getAllPatients() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(repo.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> getAllPatients(Pageable pageable) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(repo.findAll(pageable));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    public ResponseEntity<?> getPatients(String searchQuery, Pageable pageable) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(repo.findByNameContaining(searchQuery, pageable));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> getPatientById(Integer id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(repo.findPatientById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> savePatient(PatientEntity patient) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(repo.save(patient));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> deletePatient(Integer id) {
        try {
            repo.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body(id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}