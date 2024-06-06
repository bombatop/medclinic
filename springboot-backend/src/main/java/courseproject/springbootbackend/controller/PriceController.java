package courseproject.springbootbackend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import courseproject.springbootbackend.model.dto.BulkPriceUpdateData;
import courseproject.springbootbackend.model.dto.JournalReportDTO;
import courseproject.springbootbackend.model.dto.JournalReportRequestDTO;
import courseproject.springbootbackend.model.dto.PriceData;
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

    @GetMapping
    public Page<PriceEntity> getPrices(
            @RequestParam(required = false) Integer treatmentId,
            @RequestParam(required = false) Integer agencyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "date") String sortField,
            @RequestParam(defaultValue = "asc") String sortOrder,
            @RequestParam(defaultValue = "false") boolean latestOnly) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder), sortField);
        Pageable pageable = PageRequest.of(page, size, sort);
        return service.getPrices(pageable, treatmentId, agencyId, latestOnly);
    }
    
    @PostMapping
    public PriceEntity addPriceForTreatment(@Valid @RequestBody PriceData dto) {
        return service.addPriceForTreatment(dto);
    }

    @PostMapping("/bulk")
    public List<PriceEntity> bulkUpdatePrices(@Valid @RequestBody BulkPriceUpdateData dto) {
        return service.bulkUpdatePrices(dto);
    }

    @PostMapping("report/{id}")
    public JournalReportDTO generateJournalReport(
            @PathVariable Integer id,
            @RequestBody @Valid JournalReportRequestDTO requestDTO) {
        return service.generateJournalReport(id, requestDTO.agencyIds());
    }
    
    @DeleteMapping("{id}")
    public void deletePrice(@PathVariable("id") Integer id) {
        service.deletePrice(id);
    }
}
