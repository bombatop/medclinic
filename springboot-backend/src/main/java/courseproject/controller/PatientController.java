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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import courseproject.model.*;
import courseproject.service.PatientService;

@RestController
@RequestMapping("/api")
public class PatientController {
    @Autowired
    private PatientService service;

    @GetMapping("/patients")
    public ResponseEntity<?> getPatients(
            @RequestParam(required = false) String searchQuery,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) 
    {
        if (page == null || size == null) {
            return service.getAllPatients();
        }

        Pageable pageable = PageRequest.of(page, size);
        if (searchQuery != null && !searchQuery.isEmpty()) {
            return service.getPatients(searchQuery, pageable);
        }
        return service.getAllPatients(pageable);
    }

    @GetMapping("/patient/{id}")
    public ResponseEntity<?> getPatientById(@PathVariable("id") Integer id) {
        return service.getPatientById(id);
    }

    @PostMapping("/updatePatient/{id}")
    public ResponseEntity<?> updatePatient(@PathVariable("id") Integer id, @Valid @RequestBody Patient patient,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return service.savePatient(patient);
    }

    @PostMapping("/addPatient")
    public ResponseEntity<?> addPatient(@Valid @RequestBody Patient patient, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return service.savePatient(patient);
    }

    @DeleteMapping("/deletePatient/{id}")
    public ResponseEntity<?> deletePatient(@PathVariable("id") Integer id) {
        return service.deletePatient(id);
    }
}
