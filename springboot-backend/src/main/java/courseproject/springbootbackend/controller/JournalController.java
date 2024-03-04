package courseproject.springbootbackend.controller;

import java.util.Date;

import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import courseproject.springbootbackend.model.*;
import courseproject.springbootbackend.service.JournalService;

@RestController
@RequestMapping("/api/")
public class JournalController {
    @Autowired
    private JournalService service;
    
    @GetMapping("/journalsByDateRange")
    public ResponseEntity<?> getJournalsByDateRange(
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate) {
        return service.getJournalsByDateRange(startDate);
    }

    @GetMapping("/journalsForPatient/{patientId}")
    public ResponseEntity<?> getJournalsForPatient(@PathVariable("patientId") Integer patientId) {
        return service.getJournalsForPatient(patientId);
    }
    
    @PostMapping("/reportPricesForDoctors")
    public ResponseEntity<?> getReportPricesForDoctors(
            @Validated @RequestBody RequestDTO_ReportProfitsForDoctors req,
            BindingResult bindingResult) 
    {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return service.reportPricesForDoctors(req.getDoctors(), req.getStartDate(), req.getEndDate());
    }

    @GetMapping("/journals")
    public ResponseEntity<?> getJournals() {
        return service.getAllJournals();
    }

    @GetMapping("/journal/{id}")
    public ResponseEntity<?> getJournalById(@PathVariable("id") Integer id) {
        return service.getJournalById(id);
    }

    @PostMapping("/updateJournal/{id}")
    public ResponseEntity<?> updateJournal(@PathVariable("id") Integer id, @Validated @RequestBody Journal journal,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return service.updateJournal(journal);
    }

    @PostMapping("/addJournal")
    public ResponseEntity<?> addJournal(@Validated @RequestBody Journal journal, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(bindingResult.getAllErrors());
        }
        return service.addJournal(journal);
    }

    @DeleteMapping("/deleteJournal/{id}")
    public ResponseEntity<?> deleteJournal(@PathVariable("id") Integer id) {
        return service.deleteJournal(id);
    }
}
