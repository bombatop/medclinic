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

import courseproject.springbootbackend.model.dto.TreatmentCreation;
import courseproject.springbootbackend.model.entity.TreatmentEntity;
import courseproject.springbootbackend.service.TreatmentService;
import courseproject.springbootbackend.utility.PathsUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = PathsUtils.DOCTORS_PATH)
@RequiredArgsConstructor
public class TreatmentController {

    private final TreatmentService service;

    @GetMapping
    public Page<TreatmentEntity> getTreatments(
            @RequestParam(required = false) String searchQuery,
            @RequestParam Integer page,
            @RequestParam Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        if (searchQuery != null && !searchQuery.isEmpty()) {
            return service.getTreatments(searchQuery, pageable);
        }
        return service.getAllTreatments(pageable);
    }

    @GetMapping("{id}")
    public TreatmentEntity getTreatmentById(@PathVariable Integer id) {
        return service.getTreatmentById(id);
    }

    @PutMapping("{id}")
    public TreatmentEntity updateTreatment(@PathVariable Integer id, @Valid @RequestBody TreatmentCreation doctor) {
        return service.updateTreatment(id, doctor);
    }

    @PostMapping
    public TreatmentEntity addTreatment(@Valid @RequestBody TreatmentCreation doctor) {
        return service.addTreatment(doctor);
    }

    @DeleteMapping("{id}")
    public void deleteTreatment(@PathVariable Integer id) {
        service.deleteTreatment(id);
    }
}