package courseproject.service;

import courseproject.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import courseproject.repository.DoctorRepository;

@Service
public class DoctorService {
    @Autowired
    private DoctorRepository doctorRepo;
    
    public ResponseEntity<?> getAllDoctors() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(doctorRepo.findDoctors());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }
    
    public ResponseEntity<?> getAllDoctors(Pageable pageable) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(doctorRepo.findDoctors(pageable));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }
    public ResponseEntity<?> getDoctors(String searchQuery, Pageable pageable) {
        try {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(doctorRepo.findDoctors("%" + searchQuery + "%", pageable));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> getDoctorById(Integer id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(doctorRepo.findDoctorById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> saveDoctor(Doctor doctor) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(doctorRepo.save(doctor));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> deleteDoctor(Integer id) {
        try {
            doctorRepo.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body(id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }
}