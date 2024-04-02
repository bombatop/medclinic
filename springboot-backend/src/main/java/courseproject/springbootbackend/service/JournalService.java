package courseproject.springbootbackend.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import courseproject.springbootbackend.controller.TreatmentDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import courseproject.springbootbackend.repository.DoctorRepository;
import courseproject.springbootbackend.repository.JournalRepository;
import courseproject.springbootbackend.repository.PatientRepository;
import courseproject.springbootbackend.repository.JournalTreatmentRepository;
import courseproject.springbootbackend.repository.TreatmentRepository;

import courseproject.springbootbackend.model.Doctor;
import courseproject.springbootbackend.model.Journal;
import courseproject.springbootbackend.model.JournalTreatment;
import courseproject.springbootbackend.model.Treatment;

@Service
public class JournalService {
    @Autowired
    private JournalRepository journalRepo;
    @Autowired
    private PatientRepository patientRepo;
    @Autowired
    private DoctorRepository doctorRepo;
    @Autowired
    private TreatmentRepository treatmentRepo;
    @Autowired
    private JournalTreatmentRepository journalTreatmentRepo;

    public ResponseEntity<?> getJournalsForPatient(Integer patientId) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(journalRepo.findJournalsForPatient(patientId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> getJournalsByDateRange(Date startDate) {
        try {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(startDate);
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            startDate = calendar.getTime();
            calendar.add(Calendar.DAY_OF_MONTH, 6);
            calendar.add(Calendar.HOUR_OF_DAY, 23);
            calendar.add(Calendar.MINUTE, 59);
            Date endDate = calendar.getTime();

            return ResponseEntity.status(HttpStatus.OK).body(journalRepo.findJournalsByDateRange(startDate, endDate));
        } 
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    
    public ResponseEntity<?> getAllJournals() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(journalRepo.findJournals());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> getJournalById(Integer id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(journalRepo.findJournalById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> addJournal(Journal journal) {
        try {
            journal.setDoctor(doctorRepo.findDoctorById(journal.getDoctor().getId()));
            journal.setPatient(patientRepo.findPatientById(journal.getPatient().getId()));
            return ResponseEntity.status(HttpStatus.OK).body(journalRepo.save(journal));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> updateJournal(Journal journal) {
        try {
            journal.setDoctor(doctorRepo.findDoctorById(journal.getDoctor().getId()));
            journal.setPatient(patientRepo.findPatientById(journal.getPatient().getId()));
            return ResponseEntity.status(HttpStatus.OK).body(journalRepo.save(journal));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> deleteJournal(Integer id) {
        try {
            journalRepo.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body(id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> addTreatmentToJournal(Integer journalId, Integer treatmentId, Integer amount) {
        try {
            JournalTreatment journalTreatment = new JournalTreatment();
            journalTreatment.setJournal(journalRepo.findJournalById(journalId));
            journalTreatment.setTreatment(treatmentRepo.findTreatmentById(treatmentId));
            journalTreatment.setAmount(amount);
            return ResponseEntity.status(HttpStatus.OK).body(journalTreatmentRepo.save(journalTreatment));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> addTreatmentsToJournal(Integer journalId, List<TreatmentDTO> treatments) {
        try {
            List<JournalTreatment> journalTreatments = new ArrayList<>();
            Journal journal = journalRepo.findJournalById(journalId);
            for (TreatmentDTO treatment : treatments) {
                JournalTreatment journalTreatment = new JournalTreatment();
                journalTreatment.setJournal(journal);
                journalTreatment.setTreatment(treatmentRepo.findTreatmentById(treatment.getTreatmentId()));
                journalTreatment.setAmount(treatment.getAmount());
                journalTreatments.add(journalTreatment);
            } 
            return ResponseEntity.status(HttpStatus.OK).body(journalTreatmentRepo.saveAll(journalTreatments));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
