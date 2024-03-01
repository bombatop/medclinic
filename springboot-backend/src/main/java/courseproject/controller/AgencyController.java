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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import courseproject.model.*;
import courseproject.service.AgencyService;

@RestController
@RequestMapping("/api")
public class AgencyController {
    @Autowired
    private AgencyService service;

    @GetMapping("/agencies")
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
    
    @GetMapping("/agency/{id}")
    public ResponseEntity<?> getAgencyById(@PathVariable("id") Integer id) {
        return service.getAgencyById(id);
    }

    @PostMapping("/updateAgency/{id}")
    public ResponseEntity<?> updateAgency(@PathVariable("id") Integer id, @Valid @RequestBody Agency agency,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return service.saveAgency(agency);
    }

    @PostMapping("/addAgency")
    public ResponseEntity<?> addAgency(@Valid @RequestBody Agency agency, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return service.saveAgency(agency);
    }

    @DeleteMapping("/deleteAgency/{id}")
    public ResponseEntity<?> deleteAgency(@PathVariable("id") Integer id) {
        return service.deleteAgency(id);
    }
}
