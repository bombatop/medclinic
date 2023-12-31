package courseproject.service;

import java.util.Date;
import java.util.Iterator;
import java.util.Set;

import courseproject.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import courseproject.repository.JournalRepository;
import courseproject.repository.PriceRepository;
import courseproject.repository.TreatmentRepository;

@Service
public class PriceService {
    @Autowired
    private PriceRepository priceRepo;
    @Autowired
    private TreatmentRepository treatmentRepo;

    @Autowired
    private JournalRepository journalRepo;

    public Price getPriceForTreatmentAndDate(Treatment t, Date d) {
        return priceRepo.findPriceForTreatmentAndDate(t, d);
    }

    public ResponseEntity<?> getPricesByTreatmentId(Integer id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(priceRepo.findPricesByTreatmentId(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }


    public ResponseEntity<?> savePrice(Price price) {
        try {
            price.setTreatment(treatmentRepo.findTreatmentById(price.getTreatment().getId()));
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

    public ResponseEntity<?> addPriceForTreatment(Price price) {
        try {
            Treatment t = treatmentRepo.findTreatmentById(price.getTreatment().getId());
            price.setTreatment(t);
            return ResponseEntity.status(HttpStatus.OK).body(priceRepo.save(price));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    public ResponseEntity<?> addPriceForJournal(Integer id, Treatment t, Date d){
        try {
            Price price = priceRepo.findPriceForTreatmentAndDate(t, d);
            if (price == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("There is no price for this treatment");
            }
            Journal journal = journalRepo.findJournalById(id);
            journal.getPrices().add(price);
            journalRepo.save(journal);
            return ResponseEntity.status(HttpStatus.OK).body(price);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }
    
    public ResponseEntity<?> deletePriceForJournal(Integer journal_id, Integer price_id) {
        try {
            Journal journal = journalRepo.findJournalById(journal_id);
            Set <Price> prices = journal.getPrices();
            Iterator<Price> iterator = prices.iterator();
            while (iterator.hasNext()) {
                Price p = iterator.next();
                if (p.getId().equals(price_id)) {
                    iterator.remove();
                    break;
                }
            }
            journalRepo.save(journal);
            return ResponseEntity.status(HttpStatus.OK).body(price_id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }
}   