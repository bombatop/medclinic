package courseproject.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import courseproject.controller.ResponseDTO_ReportProfitsForDoctors;
import courseproject.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import courseproject.repository.DoctorRepository;
import courseproject.repository.JournalRepository;
import courseproject.repository.PatientRepository;

@Service
public class JournalService {
    @Autowired
    private JournalRepository journalRepo;

    @Autowired
    private PatientRepository patientRepo;

    @Autowired
    private DoctorRepository doctorRepo;
    
    public ResponseEntity<?> reportPricesForDoctors(List<Integer> doctorIds, Date startDate, Date endDate) {
        try {
            List<Object[]> data = journalRepo.getReportPricesForDoctors(doctorIds, startDate, endDate);

            List<ResponseDTO_ReportProfitsForDoctors> report = new ArrayList<>();
            for (Object[] row : data) {
                Doctor doctor = (Doctor) row[0];
                Long numberOfJournals = (Long) row[1];
                Long sumOfPrices = (Long) row[2];

                ResponseDTO_ReportProfitsForDoctors dto = new ResponseDTO_ReportProfitsForDoctors(doctor, numberOfJournals,
                        sumOfPrices);
                report.add(dto);
            }
            return ResponseEntity.status(HttpStatus.OK).body(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

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
            if (!journal.getPrices().isEmpty() && !journal.getDate().equals(journalRepo.findJournalById(journal.getId()).getDate())) {
                throw new IllegalArgumentException("Date cannot be changed after price has been established");
            }
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
}
