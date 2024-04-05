package courseproject.springbootbackend.service;

import java.util.Date;

import courseproject.springbootbackend.model.entity.PriceEntity;
import courseproject.springbootbackend.model.entity.TreatmentEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import courseproject.springbootbackend.repository.AgencyRepository;
import courseproject.springbootbackend.repository.JournalRepository;
import courseproject.springbootbackend.repository.PriceRepository;
import courseproject.springbootbackend.repository.TreatmentRepository;

@Service
public class PriceService {
    @Autowired
    private PriceRepository priceRepo;
    @Autowired
    private TreatmentRepository treatmentRepo;
    @Autowired
    private JournalRepository journalRepo;
    @Autowired
    private AgencyRepository agencyRepo;

    public PriceEntity getPriceForTreatmentAndDate(TreatmentEntity t, Date d) {
        return priceRepo.findPriceByTreatmentAndDate(t, d);
    }

    public ResponseEntity<?> getPricesByTreatmentId(Integer id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(priceRepo.findByTreatmentIdOrderByDateDesc(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> savePrice(PriceEntity price) {
        try {
            // price.setTreatment(treatmentRepo.findTreatmentById(price.getTreatment().getId()));
            // price.setAgency(agencyRepo.findAgencyById(price.getAgency().getId()));
            return ResponseEntity.status(HttpStatus.OK).body(priceRepo.save(price));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> deletePrice(Integer id) {
        try {
            priceRepo.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body(id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> addPriceForTreatment(PriceEntity price) {
        try {
            price.setTreatment(treatmentRepo.findTreatmentById(price.getTreatment().getId()));
            price.setAgency(agencyRepo.findAgencyById(price.getAgency().getId()));
            return ResponseEntity.status(HttpStatus.OK).body(priceRepo.save(price));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }
}   