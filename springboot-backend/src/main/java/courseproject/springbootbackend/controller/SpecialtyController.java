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

import courseproject.springbootbackend.model.dto.SpecialtyData;
import courseproject.springbootbackend.model.entity.SpecialtyEntity;
import courseproject.springbootbackend.service.SpecialtyService;
import courseproject.springbootbackend.utility.PathsUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = PathsUtils.SPECIALTIES_PATH)
@RequiredArgsConstructor
public class SpecialtyController {

    private final SpecialtyService service;

    @GetMapping
    public Page<SpecialtyEntity> getSpecialties(
            @RequestParam(required = false) String searchQuery,
            @RequestParam Integer page,
            @RequestParam Integer size,
            @RequestParam(defaultValue = "name") String sortField,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder), sortField);
        Pageable pageable = PageRequest.of(page, size, sort);
        return service.getSpecialties(searchQuery, pageable);
    }

    @GetMapping("{id}")
    public SpecialtyEntity getSpecialtyById(@PathVariable Integer id) {
        return service.getSpecialtyById(id);
    }

    @PutMapping("{id}")
    public SpecialtyEntity updateSpecialty(
            @PathVariable Integer id,
            @Valid @RequestBody SpecialtyData dto) {
        return service.updateSpecialty(id, dto);
    }

    @PostMapping
    public SpecialtyEntity addSpecialty(@Valid @RequestBody SpecialtyData dto) {
        return service.addSpecialty(dto);
    }

    @DeleteMapping("{id}")
    public void deleteSpecialty(@PathVariable Integer id) {
        service.deleteSpecialty(id);
    }
}