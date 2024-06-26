package courseproject.springbootbackend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import courseproject.springbootbackend.model.dto.PatientData;
import courseproject.springbootbackend.model.entity.PatientEntity;
import courseproject.springbootbackend.service.PatientService;
import courseproject.springbootbackend.utility.PathsUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = PathsUtils.PATIENTS_PATH)
@RequiredArgsConstructor
public class PatientController {

    private final PatientService service;
    
    @GetMapping
    public Page<PatientEntity> getPatients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String searchQuery,
            @RequestParam(defaultValue = "surname") String sortField,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        Sort sort = Sort.by(Sort.Order.by(sortField).with(Sort.Direction.fromString(sortOrder)));
        Pageable pageable = PageRequest.of(page, size, sort);
        return service.getPatients(searchQuery, pageable);
    }

    @GetMapping("{id}")
    public PatientEntity getPatientById(@PathVariable Integer id) {
        return service.getPatientById(id);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("{id}")
    public PatientEntity updatePatient(
            @PathVariable Integer id,
            @Valid @RequestBody PatientData patient) {
        return service.updatePatient(id, patient);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping
    public PatientEntity addPatient(@Valid @RequestBody PatientData patient) {
        return service.addPatient(patient);
    }

    @DeleteMapping("{id}")
    public void deletePatient(@PathVariable Integer id) {
        service.deletePatient(id);
    }
}