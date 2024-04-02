package courseproject.springbootbackend.controller;

import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.beans.factory.annotation.Autowired;
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
import courseproject.springbootbackend.service.PatientService;
import courseproject.springbootbackend.utility.PathsUtils;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = PathsUtils.PATIENTS_PATH)
@RequiredArgsConstructor
public class PatientController {
    
    private final PatientService patientService;

    @GetMapping
    public ResponseEntity<?> getPatients(
            @RequestParam(required = false) String searchQuery,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) 
    {
        if (page == null || size == null) {
            return patientService.getAllPatients();
        }

        Pageable pageable = PageRequest.of(page, size);
        if (searchQuery != null && !searchQuery.isEmpty()) {
            return patientService.getPatients(searchQuery, pageable);
        }
        return patientService.getAllPatients(pageable);
    }

    @GetMapping("{id}")
    public ResponseEntity<?> getPatientById(@PathVariable("id") Integer id) {
        return patientService.getPatientById(id);
    }

    @PutMapping("{id}")
    public ResponseEntity<?> updatePatient(@PathVariable("id") Integer id, @Validated @RequestBody Patient patient, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return patientService.savePatient(patient);
    }

    @PostMapping
    public ResponseEntity<?> addPatient(@Validated @RequestBody Patient patient, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return patientService.savePatient(patient);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deletePatient(@PathVariable("id") Integer id) {
        return patientService.deletePatient(id);
    }
}
