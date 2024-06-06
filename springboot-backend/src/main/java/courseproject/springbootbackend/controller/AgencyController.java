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

import courseproject.springbootbackend.model.dto.AgencyData;
import courseproject.springbootbackend.model.entity.AgencyEntity;
import courseproject.springbootbackend.service.AgencyService;
import courseproject.springbootbackend.utility.PathsUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = PathsUtils.AGENCIES_PATH)
@RequiredArgsConstructor
public class AgencyController {

    private final AgencyService service;

    @GetMapping
    public Page<AgencyEntity> getAgencies(
            @RequestParam(required = false) String searchQuery,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortField,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder), sortField);
        Pageable pageable = PageRequest.of(page, size, sort);
        return service.getAgencies(searchQuery, pageable);
    }


    @GetMapping("{id}")
    public AgencyEntity getAgencyById(@PathVariable Integer id) {
        return service.getAgencyById(id);
    }

    @PutMapping("{id}")
    public AgencyEntity updateAgency(
        @PathVariable Integer id,
        @Valid @RequestBody AgencyData dto) {
        return service.updateAgency(id, dto);
    }

    @PostMapping
    public AgencyEntity addAgency(@Valid @RequestBody AgencyData dto) {
        return service.addAgency(dto);
    }

    @DeleteMapping("{id}")
    public void deleteAgency(@PathVariable Integer id) {
        service.deleteAgency(id);
    }
}