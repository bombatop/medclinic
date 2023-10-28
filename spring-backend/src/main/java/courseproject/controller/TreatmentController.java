package courseproject.controller;

import javax.validation.Valid;

import org.springframework.validation.BindingResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import courseproject.model.*;
import courseproject.service.TreatmentService;

@RestController
@RequestMapping("/api")
public class TreatmentController {
    @Autowired
    private TreatmentService service;
    
    @GetMapping("/treatments")
    public ResponseEntity<?> getTreatments(
            @RequestParam(required = false) String searchQuery,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        if (page == null || size == null) {
            return service.getAllTreatments();
        }

        Pageable pageable = PageRequest.of(page, size);
        if (searchQuery != null && !searchQuery.isEmpty()) {
            return service.getTreatments(searchQuery, pageable);
        }
        return service.getAllTreatments(pageable);
    }

    @GetMapping("/treatment/{id}")
    public ResponseEntity<?> getTreatmentById(@PathVariable("id") Integer id) {
        return service.getTreatmentById(id);
    }

    @PostMapping("/updateTreatment/{id}")
    public ResponseEntity<?> updateTreatment(@PathVariable("id") Integer id, @Valid @RequestBody Treatment treatment,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return service.saveTreatment(treatment);
    }

    @PostMapping("/addTreatment")
    public ResponseEntity<?> addTreatment(@Valid @RequestBody Treatment treatment, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return service.saveTreatment(treatment);
    }

    @DeleteMapping("/deleteTreatment/{id}")
    public ResponseEntity<?> deleteTreatment(@PathVariable("id") Integer id) {
        return service.deleteTreatment(id);
    }
}
