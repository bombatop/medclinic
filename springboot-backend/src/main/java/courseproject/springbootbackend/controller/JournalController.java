package courseproject.springbootbackend.controller;

import java.util.Date;
import java.util.List;

import org.springframework.validation.BindingResult;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

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
    
    @GetMapping("/date/{date}")
    public ResponseEntity<?> getJournalsByDateRange(@PathVariable("date") @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate) {
        return journalService.getJournalsByDateRange(startDate);
    }

    @GetMapping
    public ResponseEntity<?> getJournals() {
        return journalService.getAllJournals();
    }

    @GetMapping("{id}")
    public ResponseEntity<?> getJournalById(@PathVariable("id") Integer id) {
        return journalService.getJournalById(id);
    }

    @GetMapping("/patient/{id}")
    public ResponseEntity<?> getJournalsForPatient(@PathVariable("id") Integer id) {
        return journalService.getJournalsForPatient(id);
    }

    @PutMapping("{id}")
    public ResponseEntity<?> updateJournal(@PathVariable("id") Integer id, @Valid @RequestBody JournalEntity journal) {
        return journalService.updateJournal(journal);
    }

    @PostMapping
    public ResponseEntity<?> addJournal(@Valid @RequestBody JournalEntity journal, BindingResult bindingResult) {
        return journalService.addJournal(journal);
    }

    @PostMapping("/treatment")
    public JournalTreatmentEntity addTreatmentToJournal(@PathVariable Integer journalId, @RequestBody JournalTreatmentCreation dto) {
        return journalService.addTreatmentToJournal(journalId, dto);
    }

    @PostMapping("/treatments")
    public List<JournalTreatmentEntity> addTreatmentsToJournal(@PathVariable Integer journalId,
        @RequestBody List<JournalTreatmentCreation> treatments) {
        return journalService.addTreatmentsToJournal(journalId, treatments);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteJournal(@PathVariable("id") Integer id) {
        return journalService.deleteJournal(id);
    }
}
