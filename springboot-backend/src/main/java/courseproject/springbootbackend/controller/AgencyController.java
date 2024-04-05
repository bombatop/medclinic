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
import courseproject.springbootbackend.service.AgencyService;
import courseproject.springbootbackend.utility.PathsUtils;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = PathsUtils.AGENCIES_PATH)
@RequiredArgsConstructor
public class AgencyController {
    
    private final AgencyService service;

    @GetMapping
    public ResponseEntity<?> getAgencies(
            @RequestParam(required = false) String searchQuery,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        if (page == null || size == null) {
            return service.getAllAgencies();
        }

        Pageable pageable = PageRequest.of(page, size);
        if (searchQuery != null && !searchQuery.isEmpty()) {
            return service.getAgencies(searchQuery, pageable);
        }
        return service.getAllAgencies(pageable);
    }
    
    @GetMapping("{id}")
    public ResponseEntity<?> getAgencyById(@PathVariable("id") Integer id) {
        return service.getAgencyById(id);
    }

    @PutMapping("{id}")
    public ResponseEntity<?> updateAgency(@PathVariable("id") Integer id, @Validated @RequestBody Agency agency,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return service.saveAgency(agency);
    }

    @PostMapping
    public ResponseEntity<?> addAgency(@Validated @RequestBody Agency agency, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return service.saveAgency(agency);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteAgency(@PathVariable("id") Integer id) {
        return service.deleteAgency(id);
    }
}
