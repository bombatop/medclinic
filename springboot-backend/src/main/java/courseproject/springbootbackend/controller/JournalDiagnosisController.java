package courseproject.springbootbackend.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;

import courseproject.springbootbackend.model.dto.JournalDiagnosisCreation;
import courseproject.springbootbackend.model.dto.JournalDiagnosisModification;
import courseproject.springbootbackend.model.entity.JournalDiagnosisEntity;
import courseproject.springbootbackend.service.JournalDiagnosisService;
import courseproject.springbootbackend.utility.PathsUtils;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = PathsUtils.JOURNALS_PATH)
@RequiredArgsConstructor
public class JournalDiagnosisController {

    private final JournalDiagnosisService journalDiagnosisService;

    @PostMapping("{journalId}/diagnosis")
    public JournalDiagnosisEntity addDiagnosisToJournal(@PathVariable Integer journalId,
            @RequestBody JournalDiagnosisCreation dto) {
        return journalDiagnosisService.addDiagnosisToJournal(journalId, dto);
    }

    @PutMapping("{journalId}/diagnosis/{diagnosisId}")
    public JournalDiagnosisEntity updateDiagnosisOfJournal(@PathVariable Integer journalId,
            @PathVariable Integer diagnosisId,
            @RequestBody JournalDiagnosisModification dto) {
        return journalDiagnosisService.updateDiagnosisOfJournal(journalId, diagnosisId, dto);
    }

    @DeleteMapping("{journalId}/diagnosis/{diagnosisId}")
    public void deleteJournalDiagnosis(@PathVariable Integer journalId,
            @PathVariable Integer diagnosisId) {
        journalDiagnosisService.deleteJournalDiagnosis(journalId, diagnosisId);
    }
}
