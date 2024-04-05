package courseproject.springbootbackend.controller;

import java.util.Date;
import java.util.List;

import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.format.annotation.DateTimeFormat;
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

import courseproject.springbootbackend.model.*;
import courseproject.springbootbackend.service.JournalService;
import courseproject.springbootbackend.utility.PathsUtils;
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
    public ResponseEntity<?> updateJournal(@PathVariable("id") Integer id, @Validated @RequestBody Journal journal, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return journalService.updateJournal(journal);
    }

    @PostMapping
    public ResponseEntity<?> addJournal(@Validated @RequestBody Journal journal, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return journalService.addJournal(journal);
    }

    @PostMapping("/treatment")
    public ResponseEntity<?> addTreatmentToJournal(@PathVariable Integer journalId, @RequestParam Integer treatmentId, @RequestParam Integer amount) {
        return journalService.addTreatmentToJournal(journalId, treatmentId, amount);
    }

    @PostMapping("/treatments")
    public ResponseEntity<?> addTreatmentsToJournal(@PathVariable Integer journalId, @RequestBody List<TreatmentDTO> treatments) {
        return journalService.addTreatmentsToJournal(journalId, treatments);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteJournal(@PathVariable("id") Integer id) {
        return journalService.deleteJournal(id);
    }
}
