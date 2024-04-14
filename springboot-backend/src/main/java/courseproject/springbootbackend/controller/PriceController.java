package courseproject.springbootbackend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import courseproject.springbootbackend.model.dto.PriceCreation;
import courseproject.springbootbackend.model.entity.PriceEntity;
import courseproject.springbootbackend.service.PriceService;
import courseproject.springbootbackend.utility.PathsUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = PathsUtils.PRICES_PATH)
@RequiredArgsConstructor
public class PriceController {
    
    private final PriceService service;

    @GetMapping("{id}")
    public List<PriceEntity> getPricesByTreatmentId(@PathVariable("id") Integer id) {
        return service.getPricesByTreatmentId(id);
    }
    
    @PostMapping
    public PriceEntity addPriceForTreatment(@Valid @RequestBody PriceCreation dto) {
        return service.addPriceForTreatment(dto);
    }
    
    @DeleteMapping("{id}")
    public void deletePrice(@PathVariable("id") Integer id) {
        service.deletePrice(id);
    }
}
