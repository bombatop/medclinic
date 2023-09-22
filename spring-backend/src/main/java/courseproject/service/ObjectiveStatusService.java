package courseproject.service;

import courseproject.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import courseproject.repository.ObjectiveStatusRepository;

@Service
public class ObjectiveStatusService {
    @Autowired
    private ObjectiveStatusRepository anamnesisRepo;

    public ResponseEntity<?> getAllObjectiveStatuses() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(anamnesisRepo.findObjectiveStatuses());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> getAllObjectiveStatuses(Pageable pageable) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(anamnesisRepo.findObjectiveStatuses(pageable));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> getObjectiveStatuses(String searchQuery, Pageable pageable) {
        try {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(anamnesisRepo.findObjectiveStatuses("%" + searchQuery + "%", pageable));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> getObjectiveStatusById(Integer id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(anamnesisRepo.findObjectiveStatusById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> saveObjectiveStatus(ObjectiveStatus anamnesis) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(anamnesisRepo.save(anamnesis));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> deleteObjectiveStatus(Integer id) {
        try {
            anamnesisRepo.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body(id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }
}