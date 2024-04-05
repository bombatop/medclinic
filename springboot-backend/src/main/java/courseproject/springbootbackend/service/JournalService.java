package courseproject.springbootbackend.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import courseproject.springbootbackend.model.dto.JournalTreatmentCreation;
import courseproject.springbootbackend.model.entity.DoctorEntity;
import courseproject.springbootbackend.model.entity.JournalEntity;
import courseproject.springbootbackend.model.entity.JournalTreatmentEntity;
import courseproject.springbootbackend.model.entity.TreatmentEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import courseproject.springbootbackend.repository.DoctorRepository;
import courseproject.springbootbackend.repository.JournalRepository;
import courseproject.springbootbackend.repository.PatientRepository;
import courseproject.springbootbackend.repository.JournalTreatmentRepository;
import courseproject.springbootbackend.repository.TreatmentRepository;
import courseproject.springbootbackend.service.exception.JournalNotFoundException;

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
            return ResponseEntity.status(HttpStatus.OK).body(journalRepo.findByPatient(patientId));
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

            return ResponseEntity.status(HttpStatus.OK).body(journalRepo.findByDateRange(startDate, endDate));
        } 
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    
    public ResponseEntity<?> getAllJournals() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(journalRepo.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> getJournalById(Integer id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(journalRepo.findById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> addJournal(JournalEntity journal) {
        try {
            journal.setDoctor(doctorRepo.findDoctorById(journal.getDoctor().getId()));
            journal.setPatient(patientRepo.findPatientById(journal.getPatient().getId()));
            return ResponseEntity.status(HttpStatus.OK).body(journalRepo.save(journal));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> updateJournal(JournalEntity journal) {
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

    public JournalTreatmentEntity addTreatmentToJournal(Integer journalId, JournalTreatmentCreation dto) {
        Optional<JournalEntity> journal = journalRepo.findById(journalId);
        if (!journal.isPresent()) {
            throw new JournalNotFoundException();
        }
        Optional<TreatmentEntity> treatment = treatmentRepo.findById(dto.treatmentId());
        if (!treatment.isPresent()) {
            throw new JournalNotFoundException();
        }
        JournalTreatmentEntity journalTreatment = new JournalTreatmentEntity();
        try {
            journalTreatment.setJournal(journal.get());
            journalTreatment.setTreatment(treatment.get());
            journalTreatment.setAmount(dto.amount());
            journalTreatment = journalTreatmentRepo.save(journalTreatment);
            return journalTreatment;
        } catch (final DataIntegrityViolationException e) {
            // log.error(e.getMessage());
            throw new JournalNotFoundException(); //change
        }
    }

    public List<JournalTreatmentEntity> addTreatmentsToJournal(Integer journalId, List<JournalTreatmentCreation> dtos) {
        Optional<JournalEntity> journal = journalRepo.findById(journalId);
        if (!journal.isPresent()) {
            throw new JournalNotFoundException();
        }
        try {
            List<JournalTreatmentEntity> journalTreatments = new ArrayList<>();
            for (JournalTreatmentCreation dto : dtos) {
                JournalTreatmentEntity obj = new JournalTreatmentEntity();
                Optional<TreatmentEntity> treatment = treatmentRepo.findById(journalId);
                if (!treatment.isPresent()) {
                    throw new JournalNotFoundException(); //treatment
                }
                obj.setJournal(journal.get());
                obj.setTreatment(treatment.get());
                obj.setAmount(dto.amount());
            } 
            journalTreatments = journalTreatmentRepo.saveAll(journalTreatments);
            return journalTreatments;
        } catch (Exception e) {
            throw new JournalNotFoundException(); //change
        }
    }
}
