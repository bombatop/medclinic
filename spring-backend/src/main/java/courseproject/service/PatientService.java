package courseproject.service;

import courseproject.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import courseproject.repository.PatientRepository;

@Service
public class PatientService {
    @Autowired
    private PatientRepository patientRepo;

    public ResponseEntity<?> getAllPatients() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(patientRepo.findPatients());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> getAllPatients(Pageable pageable) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(patientRepo.findPatients(pageable));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    public ResponseEntity<?> getPatients(String searchQuery, Pageable pageable) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(patientRepo.findPatients("%" + searchQuery + "%", pageable));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> getPatientById(Integer id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(patientRepo.findPatientById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> savePatient(Patient patient) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(patientRepo.save(patient));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> deletePatient(Integer id) {
        try {
            patientRepo.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body(id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}