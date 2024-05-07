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

import courseproject.springbootbackend.model.dto.DiagnosisCreation;
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
    public Page<DiagnosisEntity> getDiagnosis(
            @RequestParam(required = false) String searchQuery,
            @RequestParam Integer page,
            @RequestParam Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        if (searchQuery != null && !searchQuery.isEmpty()) {
            return service.getDiagnosis(searchQuery, pageable);
        }
        return service.getAllDiagnosis(pageable);
    }

    @GetMapping("{id}")
    public DiagnosisEntity getDiagnosisById(@PathVariable Integer id) {
        return service.getDiagnosisById(id);
    }

    @PutMapping("{id}")
    public DiagnosisEntity updateDiagnosis(@PathVariable Integer id, @Valid @RequestBody DiagnosisCreation diagnosis) {
        return service.updateDiagnosis(id, diagnosis);
    }

    @PostMapping
    public DiagnosisEntity addDiagnosis(@Valid @RequestBody DiagnosisCreation diagnosis) {
        return service.addDiagnosis(diagnosis);
    }

    @DeleteMapping("{id}")
    public void deleteDiagnosis(@PathVariable Integer id) {
        service.deleteDiagnosis(id);
    }
}