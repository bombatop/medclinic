package courseproject.springbootbackend.controller;

import java.util.List;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import courseproject.springbootbackend.model.dto.JournalCreation;
import courseproject.springbootbackend.model.entity.JournalEntity;
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
    public JournalEntity getJournalById(@PathVariable Integer id) {
        return journalService.getJournalById(id);
    }

    @GetMapping("patient/{id}")
    public List<JournalEntity> getJournalsForPatient(@PathVariable Integer id) {
        return journalService.getJournalsForPatient(id);
    }

    @GetMapping("date/{date}")
    public List<JournalEntity> getJournalsByDateRange(
            @PathVariable("date") String dateString) {
        LocalDate startDate = LocalDate.parse(dateString, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        return journalService.getJournalsByDateRange(startDate.atStartOfDay());
    }

    @PostMapping
    public JournalEntity addJournal(@Valid @RequestBody JournalCreation dto) {
        return journalService.addJournal(dto);
    }

    @PutMapping("{id}")
    public JournalEntity updateJournal(@PathVariable Integer id,
            @Valid @RequestBody JournalCreation dto) {
        return journalService.updateJournal(id, dto);
    }

    @DeleteMapping("{id}")
    public void deleteJournal(@PathVariable Integer id) {
        journalService.deleteJournal(id);
    }
}