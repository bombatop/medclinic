package courseproject.service;

import courseproject.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import courseproject.repository.AgreementRepository;

@Service
public class AgreementService {
    @Autowired
    private AgreementRepository repo;

    public ResponseEntity<?> getAllAgreements() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(repo.findAgreements());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> getAgreementById(Integer id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(repo.findAgreementsByPatientId(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> getAgreementByPatientId(Integer id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(repo.findAgreementById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> saveAgreement(Agreement doctor) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(repo.save(doctor));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> deleteAgreement(Integer id) {
        try {
            repo.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body(id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}