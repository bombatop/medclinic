package courseproject.springbootbackend.controller;

import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import courseproject.springbootbackend.model.*;
import courseproject.springbootbackend.model.entity.Treatment;
import courseproject.springbootbackend.service.TreatmentService;
import courseproject.springbootbackend.utility.PathsUtils;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = PathsUtils.TREATMENTS_PATH)
@RequiredArgsConstructor
public class TreatmentController {
    
    private final TreatmentService service;
    
    @GetMapping
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

    @GetMapping("{id}")
    public ResponseEntity<?> getTreatmentById(@PathVariable("id") Integer id) {
        return service.getTreatmentById(id);
    }

    @PutMapping("{id}")
    public ResponseEntity<?> updateTreatment(@PathVariable("id") Integer id, @Validated @RequestBody Treatment treatment, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return service.saveTreatment(treatment);
    }

    @PostMapping
    public ResponseEntity<?> addTreatment(@Validated @RequestBody Treatment treatment, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return service.saveTreatment(treatment);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteTreatment(@PathVariable("id") Integer id) {
        return service.deleteTreatment(id);
    }
}
