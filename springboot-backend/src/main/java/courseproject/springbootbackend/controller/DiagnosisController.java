package courseproject.springbootbackend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import courseproject.springbootbackend.model.dto.DiagnosisData;
import courseproject.springbootbackend.model.entity.DiagnosisEntity;
import courseproject.springbootbackend.service.DiagnosisService;
import courseproject.springbootbackend.utility.PathsUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = PathsUtils.DIAGNOSIS_PATH)
@RequiredArgsConstructor
public class DiagnosisController {

    private final DiagnosisService service;

    @GetMapping
    public Page<DiagnosisEntity> getDiagnoses(
            @RequestParam(required = false) String searchQuery,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortField,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder), sortField);
        Pageable pageable = PageRequest.of(page, size, sort);
        return service.getDiagnoses(searchQuery, pageable);
    }

    @GetMapping("{id}")
    public DiagnosisEntity getDiagnosisById(@PathVariable Integer id) {
        return service.getDiagnosisById(id);
    }

    @PutMapping("{id}")
    public DiagnosisEntity updateDiagnosis(
            @PathVariable Integer id,
            @Valid @RequestBody DiagnosisData diagnosis) {
        return service.updateDiagnosis(id, diagnosis);
    }

    @PostMapping
    public DiagnosisEntity addDiagnosis(@Valid @RequestBody DiagnosisData diagnosis) {
        return service.addDiagnosis(diagnosis);
    }

    @DeleteMapping("{id}")
    public void deleteDiagnosis(@PathVariable Integer id) {
        service.deleteDiagnosis(id);
    }
}