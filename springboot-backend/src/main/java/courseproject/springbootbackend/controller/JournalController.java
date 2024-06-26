package courseproject.springbootbackend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import courseproject.springbootbackend.model.dto.JournalData;
import courseproject.springbootbackend.model.dto.JournalLinkData;
import courseproject.springbootbackend.model.entity.JournalEntity;
import courseproject.springbootbackend.model.entity.misc.JournalStatus;
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
    public Page<JournalEntity> getJournals(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dateStart") String sortField,
            @RequestParam(defaultValue = "asc") String sortOrder,
            @RequestParam(required = false) Integer userId,
            @RequestParam(required = false) Integer patientId,
            @RequestParam(required = false) JournalStatus status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder), sortField);
        Pageable pageable = PageRequest.of(page, size, sort);

        return journalService.getJournals(pageable, userId, patientId, status, startDate, endDate);
    }

    @GetMapping("{id}")
    public JournalEntity getJournalById(@PathVariable Integer id) {
        return journalService.getJournalById(id);
    }

    @GetMapping("all-next/{id}")
    public List<JournalEntity> getAvailableNextEntries(@PathVariable Integer id) {
        return journalService.getAvailableNextEntries(id);
    }

    @GetMapping("all-prev/{id}")
    public List<JournalEntity> getAvailablePreviousEntries(@PathVariable Integer id) {
        return journalService.getAvailablePreviousEntries(id);
    }

    @PostMapping
    public JournalEntity addJournal(@Valid @RequestBody JournalData dto) {
        return journalService.addJournal(dto);
    }

    @PostMapping("link")
    public JournalEntity addJournalAndLinkJournalEntry(@Valid @RequestBody JournalLinkData dto) {
       return journalService.addJournalAndLinkJournalEntry(dto);
    }

    @PutMapping("{id}/next/{nextId}")
    public void linkNextJournal(
            @PathVariable Integer id,
            @PathVariable Integer nextId) {
        journalService.linkNextEntry(id, nextId);
    }

    @PutMapping("{id}/unlink-next")
    public void unlinkNextJournal(@PathVariable Integer id) {
        journalService.unlinkNextEntry(id);
    }

    @PutMapping("{id}")
    public JournalEntity updateJournal(@PathVariable Integer id,
            @Valid @RequestBody JournalData dto) {
        return journalService.updateJournal(id, dto);
    }

    @DeleteMapping("{id}")
    public void deleteJournal(@PathVariable Integer id) {
        journalService.deleteJournal(id);
    }
}