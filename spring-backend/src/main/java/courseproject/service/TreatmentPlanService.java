package courseproject.service;

import courseproject.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import courseproject.repository.TreatmentPlanRepository;

@Service
public class TreatmentPlanService {
    @Autowired
    private TreatmentPlanRepository treatmentPlanRepo;

    public ResponseEntity<?> getAllTreatmentPlanes() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(treatmentPlanRepo.findTreatmentPlans());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> getAllTreatmentPlanes(Pageable pageable) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(treatmentPlanRepo.findTreatmentPlans(pageable));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> getTreatmentPlanes(String searchQuery, Pageable pageable) {
        try {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(treatmentPlanRepo.findTreatmentPlans("%" + searchQuery + "%", pageable));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> getTreatmentPlanById(Integer id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(treatmentPlanRepo.findTreatmentPlanById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> saveTreatmentPlan(TreatmentPlan treatmentPlan) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(treatmentPlanRepo.save(treatmentPlan));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> deleteTreatmentPlan(Integer id) {
        try {
            treatmentPlanRepo.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body(id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }
}