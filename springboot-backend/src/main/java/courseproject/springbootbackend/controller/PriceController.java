package courseproject.springbootbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import courseproject.springbootbackend.model.*;
import courseproject.springbootbackend.service.PriceService;

@RestController
@RequestMapping("/api")
public class PriceController {
    @Autowired
    private PriceService service;

    @GetMapping("/prices/{treatment_id}")
    public ResponseEntity<?> getPricesByTreatmentId(@PathVariable("treatment_id") Integer treatment_id) {
        return service.getPricesByTreatmentId(treatment_id);
    }
    
    @DeleteMapping("/deletePrice/{id}")
    public ResponseEntity<?> deletePrice(@PathVariable("id") Integer id) {
        return service.deletePrice(id);
    }

    @PostMapping("/addPriceForTreatment")
    public ResponseEntity<?> addPriceForTreatment(@Validated @RequestBody Price price, BindingResult bindingResult) {
        if (bindingResult.hasErrors() || price == null) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return service.savePrice(price);
    }
}
