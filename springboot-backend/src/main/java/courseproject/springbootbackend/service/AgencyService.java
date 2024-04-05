package courseproject.springbootbackend.service;

import courseproject.springbootbackend.model.*;
import courseproject.springbootbackend.model.entity.Agency;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import courseproject.springbootbackend.repository.AgencyRepository;

@Service
public class AgencyService {
    @Autowired
    private AgencyRepository repo;

    public ResponseEntity<?> getAllAgencies() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(repo.findAgencies());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> getAllAgencies(Pageable pageable) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(repo.findAgencies(pageable));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> getAgencies(String searchQuery, Pageable pageable) {
        try {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(repo.findAgencies("%" + searchQuery + "%", pageable));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> getAgencyById(Integer id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(repo.findAgencyById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> saveAgency(Agency doctor) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(repo.save(doctor));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> deleteAgency(Integer id) {
        try {
            repo.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body(id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}