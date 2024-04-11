package courseproject.springbootbackend.controller;

import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import courseproject.springbootbackend.model.dto.JournalCreation;
import courseproject.springbootbackend.model.dto.JournalModification;
import courseproject.springbootbackend.model.dto.JournalTreatmentCreation;
import courseproject.springbootbackend.model.entity.JournalEntity;
import courseproject.springbootbackend.model.entity.JournalTreatmentEntity;
import courseproject.springbootbackend.service.JournalService;
import courseproject.springbootbackend.utility.PathsUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = PathsUtils.JOURNALS_PATH)
@RequiredArgsConstructor
public class JournalController {
    
    private final JournalService journalService;

    @GetMapping
    public List<JournalEntity> getJournals() {
        return journalService.getAllJournals();
    }

    @GetMapping("{id}")
    public JournalEntity getJournalById(@PathVariable("id") Integer id) {
        return journalService.getJournalById(id);
    }

    @GetMapping("/patient/{id}")
    public List<JournalEntity> getJournalsForPatient(@PathVariable("id") Integer id) {
        return journalService.getJournalsForPatient(id);
    }

    @GetMapping("/date/{date}")
    public List<JournalEntity> getJournalsByDateRange(
            @PathVariable("date") @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate) {
        return journalService.getJournalsByDateRange(startDate);
    }

    @PutMapping("{id}")
    public JournalEntity updateJournal(@PathVariable("id") Integer id, @Valid @RequestBody JournalModification dto) {
        return journalService.updateJournal(id, dto);
    }

    @PostMapping
    public JournalEntity addJournal(@Valid @RequestBody JournalCreation dto) {
        return journalService.addJournal(dto);
    }

    @PostMapping("/treatment")
    public JournalTreatmentEntity addTreatmentToJournal(@PathVariable Integer id, @RequestBody JournalTreatmentCreation dto) {
        return journalService.addTreatmentToJournal(id, dto);
    }

    @PostMapping("/treatments")
    public List<JournalTreatmentEntity> addTreatmentsToJournal(@PathVariable Integer id,
        @RequestBody List<JournalTreatmentCreation> dtoList) {
        return journalService.addTreatmentsToJournal(id, dtoList);
    }

    @DeleteMapping("{id}")
    public void deleteJournal(@PathVariable("id") Integer id) {
        journalService.deleteJournal(id);
    }
}
