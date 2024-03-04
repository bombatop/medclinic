package courseproject.springbootbackend.controller;


import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import courseproject.springbootbackend.model.*;
import courseproject.springbootbackend.service.AgreementService;

@RestController
@RequestMapping("/api")
public class AgreementController {
    @Autowired
    private AgreementService service;

    @GetMapping("/agreement/{id}")
    public ResponseEntity<?> getAgreementById(@PathVariable("id") Integer id) {
        return service.getAgreementById(id);
    }

    @GetMapping("/agreements/{id}")
    public ResponseEntity<?> getAgreementByPatientId(@PathVariable("id") Integer id) {
        return service.getAgreementByPatientId(id);
    }

    @PostMapping("/updateAgreement/{id}")
    public ResponseEntity<?> updateAgreement(@PathVariable("id") Integer id, @Validated @RequestBody Agreement Agreement,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return service.saveAgreement(Agreement);
    }

    @PostMapping("/addAgreement")
    public ResponseEntity<?> addAgreement(@Validated @RequestBody Agreement Agreement, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return service.saveAgreement(Agreement);
    }

    @DeleteMapping("/deleteAgreement/{id}")
    public ResponseEntity<?> deleteAgreement(@PathVariable("id") Integer id) {
        return service.deleteAgreement(id);
    }
}
