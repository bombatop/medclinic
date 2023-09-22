package courseproject.service;

import courseproject.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import courseproject.repository.AnamnesisRepository;

@Service
public class AnamnesisService {
    @Autowired
    private AnamnesisRepository anamnesisRepo;

    public ResponseEntity<?> getAllAnamnesiss() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(anamnesisRepo.findAnamneses());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> getAllAnamnesiss(Pageable pageable) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(anamnesisRepo.findAnamneses(pageable));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> getAnamnesiss(String searchQuery, Pageable pageable) {
        try {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(anamnesisRepo.findAnamneses("%" + searchQuery + "%", pageable));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> getAnamnesisById(Integer id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(anamnesisRepo.findAnamnesisById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> saveAnamnesis(Anamnesis anamnesis) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(anamnesisRepo.save(anamnesis));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> deleteAnamnesis(Integer id) {
        try {
            anamnesisRepo.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body(id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }
}