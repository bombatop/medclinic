package courseproject.springbootbackend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import courseproject.springbootbackend.model.dto.PatientCreation;
import courseproject.springbootbackend.model.entity.PatientEntity;
import courseproject.springbootbackend.service.PatientService;
import courseproject.springbootbackend.utility.PathsUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = PathsUtils.DOCTORS_PATH)
@RequiredArgsConstructor
public class PatientController {

    private final PatientService service;

    @GetMapping
    public Page<PatientEntity> getPatients(
            @RequestParam(required = false) String searchQuery,
            @RequestParam Integer page,
            @RequestParam Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        if (searchQuery != null && !searchQuery.isEmpty()) {
            return service.getPatients(searchQuery, pageable);
        }
        return service.getAllPatients(pageable);
    }

    @GetMapping("{id}")
    public PatientEntity getPatientById(@PathVariable Integer id) {
        return service.getPatientById(id);
    }

    @PutMapping("{id}")
    public PatientEntity updatePatient(@PathVariable Integer id, @Valid @RequestBody PatientCreation doctor) {
        return service.updatePatient(id, doctor);
    }

    @PostMapping
    public PatientEntity addPatient(@Valid @RequestBody PatientCreation doctor) {
        return service.addPatient(doctor);
    }

    @DeleteMapping("{id}")
    public void deletePatient(@PathVariable Integer id) {
        service.deletePatient(id);
    }
}