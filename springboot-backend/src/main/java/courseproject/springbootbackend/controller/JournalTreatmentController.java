package courseproject.springbootbackend.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;

import courseproject.springbootbackend.model.dto.JournalTreatmentCreation;
import courseproject.springbootbackend.model.dto.JournalTreatmentModification;
import courseproject.springbootbackend.model.entity.JournalTreatmentEntity;
import courseproject.springbootbackend.service.JournalTreatmentService;
import courseproject.springbootbackend.utility.PathsUtils;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = PathsUtils.JOURNALS_PATH)
@RequiredArgsConstructor
public class JournalTreatmentController {

    private final JournalTreatmentService journalTreatmentService;
    
    @PostMapping("{journalId}/treatments")
    public JournalTreatmentEntity addTreatmentToJournal(
            @PathVariable Integer journalId,
            @RequestBody JournalTreatmentCreation dto) {
        return journalTreatmentService.addTreatmentToJournal(journalId, dto);
    }

    @PutMapping("{journalId}/treatments/{treatmentId}")
    public JournalTreatmentEntity updateTreatmentOfJournal(
            @PathVariable Integer journalId,
            @PathVariable Integer treatmentId,
            @RequestBody JournalTreatmentModification dto) {
        return journalTreatmentService.updateTreatmentOfJournal(journalId, treatmentId, dto);
    }

    @DeleteMapping("{journalId}/treatments/{treatmentId}")
    public void deleteJournalTreatment(
            @PathVariable Integer journalId,
            @PathVariable Integer treatmentId) {
        journalTreatmentService.deleteJournalTreatment(journalId, treatmentId);
    }
}
