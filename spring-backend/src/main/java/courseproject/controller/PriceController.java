package courseproject.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import courseproject.model.*;
import courseproject.service.PriceService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class PriceController {
    @Autowired
    private PriceService service;

    @GetMapping("/prices/{id}")
    public ResponseEntity<?> getPricesByTreatmentId(@PathVariable("id") Integer id) {
        return service.getPricesByTreatmentId(id);
    }
    
    @DeleteMapping("/deletePrice/{id}")
    public ResponseEntity<?> deletePrice(@PathVariable("id") Integer id) {
        return service.deletePrice(id);
    }

    @PostMapping("/addPriceForTreatment")
    public ResponseEntity<?> addPriceForTreatment(@Valid @RequestBody Price price, BindingResult bindingResult) {
        if (bindingResult.hasErrors() || price == null) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return service.savePrice(price);
    }
    
    @PostMapping("/addPriceForJournal/{journal_id}")
    public ResponseEntity<?> addPriceForJournal(
            @PathVariable("journal_id") Integer journal_id,
            @Valid @RequestBody RequestAddPriceForJournal req,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return service.addPriceForJournal(journal_id, req.getTreatment(), req.getDate());
    }

    @DeleteMapping("/deletePriceForJournal/{journal_id}/{price_id}")
    public ResponseEntity<?> deletePriceForJournal(
            @PathVariable("journal_id") Integer journal_id,
            @PathVariable("price_id") Integer price_id) {
        return service.deletePriceForJournal(journal_id, price_id);
    }
}
