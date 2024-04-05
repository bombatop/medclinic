package courseproject.springbootbackend.service;

import courseproject.springbootbackend.model.entity.DoctorEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import courseproject.springbootbackend.repository.DoctorRepository;

@Service
public class DoctorService {
    @Autowired
    private DoctorRepository repo;
    
    public ResponseEntity<?> getAllDoctors() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(repo.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    
    public ResponseEntity<?> getAllDoctors(Pageable pageable) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(repo.findAll(pageable));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    public ResponseEntity<?> getDoctors(String searchQuery, Pageable pageable) {
        try {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(repo.findByNameContaining(searchQuery, pageable));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> getDoctorById(Integer id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(repo.findDoctorById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> saveDoctor(DoctorEntity doctor) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(repo.save(doctor));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> deleteDoctor(Integer id) {
        try {
            repo.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body(id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}