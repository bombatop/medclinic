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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import courseproject.model.*;
import courseproject.service.DoctorService;

@RestController
@RequestMapping("/api")
public class DoctorController {
    @Autowired
    private DoctorService service;

    @GetMapping("/doctors")
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

    @GetMapping("/doctor/{id}")
    public ResponseEntity<?> getDoctorById(@PathVariable("id") Integer id) {
        return service.getDoctorById(id);
    }

    @PostMapping("/updateDoctor/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable("id") Integer id, @Valid @RequestBody Doctor doctor,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return service.saveDoctor(doctor);
    }

    @PostMapping("/addDoctor")
    public ResponseEntity<?> addDoctor(@Valid @RequestBody Doctor doctor, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return service.saveDoctor(doctor);
    }

    @DeleteMapping("/deleteDoctor/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable("id") Integer id) {
        return service.deleteDoctor(id);
    }
}
