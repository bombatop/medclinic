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

import courseproject.springbootbackend.model.dto.DoctorCreation;
import courseproject.springbootbackend.model.entity.DoctorEntity;
import courseproject.springbootbackend.service.DoctorService;
import courseproject.springbootbackend.utility.PathsUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = PathsUtils.DOCTORS_PATH)
@RequiredArgsConstructor
public class DoctorController {
    
    private final DoctorService service;

    @GetMapping
    public Page<DoctorEntity> getDoctors(
            @RequestParam(required = false) String searchQuery,
            @RequestParam Integer page,
            @RequestParam Integer size) 
    {
        Pageable pageable = PageRequest.of(page, size);
        if (searchQuery != null && !searchQuery.isEmpty()) {
            return service.getDoctors(searchQuery, pageable);
        }
        return service.getAllDoctors(pageable);
    }

    @GetMapping("{id}")
    public DoctorEntity getDoctorById(@PathVariable Integer id) {
        return service.getDoctorById(id);
    }

    @PutMapping("{id}")
    public DoctorEntity updateDoctor(@PathVariable Integer id, @Valid @RequestBody DoctorCreation doctor) {
        return service.updateDoctor(id, doctor);
    }

    @PostMapping
    public DoctorEntity addDoctor(@Valid @RequestBody DoctorCreation doctor) {
        return service.addDoctor(doctor);
    }

    @DeleteMapping("{id}")
    public void deleteDoctor(@PathVariable Integer id) {
        service.deleteDoctor(id);
    }
}