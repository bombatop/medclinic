package courseproject.springbootbackend.service;

import courseproject.springbootbackend.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import courseproject.springbootbackend.repository.DiagnosisRepository;

@Service
public class DiagnosisService {
    @Autowired
    private DiagnosisRepository diagnosisRepo;

    public ResponseEntity<?> getAllDiagnosis() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(diagnosisRepo.findDiagnoses());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> getAllDiagnosis(Pageable pageable) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(diagnosisRepo.findDiagnoses(pageable));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> getDiagnosis(String searchQuery, Pageable pageable) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(diagnosisRepo.findDiagnoses("%" + searchQuery + "%", pageable));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> getDiagnosisById(Integer id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(diagnosisRepo.findDiagnosisById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> saveDiagnosis(Diagnosis diagnosis) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(diagnosisRepo.save(diagnosis));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> deleteDiagnosis(Integer id) {
        try {
            diagnosisRepo.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body(id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }
}