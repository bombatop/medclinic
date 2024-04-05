package courseproject.springbootbackend.controller;

import org.springframework.validation.BindingResult;
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
    public ResponseEntity<?> getDoctors(
            @RequestParam(required = false) String searchQuery,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) 
    {
        if (page == null || size == null) {
            return service.getAllDoctors();
        }

        Pageable pageable = PageRequest.of(page, size);
        if (searchQuery != null && !searchQuery.isEmpty()) {
            return service.getDoctors(searchQuery, pageable);
        }
        return service.getAllDoctors(pageable);
    }

    @GetMapping("{id}")
    public ResponseEntity<?> getDoctorById(@PathVariable("id") Integer id) {
        return service.getDoctorById(id);
    }

    @PutMapping("{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable("id") Integer id, @Valid @RequestBody DoctorEntity doctor, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return service.saveDoctor(doctor);
    }

    @PostMapping
    public ResponseEntity<?> addDoctor(@Valid @RequestBody DoctorEntity doctor) {
        // if (bindingResult.hasErrors()) {
        //     return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        // }
        return service.saveDoctor(doctor);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable("id") Integer id) {
        return service.deleteDoctor(id);
    }
}
