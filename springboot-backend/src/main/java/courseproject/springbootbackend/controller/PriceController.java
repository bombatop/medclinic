package courseproject.springbootbackend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import courseproject.springbootbackend.model.*;
import courseproject.springbootbackend.model.entity.PriceEntity;
import courseproject.springbootbackend.service.PriceService;
import courseproject.springbootbackend.utility.PathsUtils;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = PathsUtils.PRICES_PATH)
@RequiredArgsConstructor
public class PriceController {
    
    private final PriceService service;

    @GetMapping("{id}")
    public ResponseEntity<?> getPricesByTreatmentId(@PathVariable("id") Integer id) {
        return service.getPricesByTreatmentId(id);
    }
    
    @PostMapping
    public ResponseEntity<?> addPriceForTreatment(@Validated @RequestBody PriceEntity price, BindingResult bindingResult) {
        if (bindingResult.hasErrors() || price == null) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return service.savePrice(price);
    }
    
    @DeleteMapping("{id}")
    public ResponseEntity<?> deletePrice(@PathVariable("id") Integer id) {
        return service.deletePrice(id);
    }
}
