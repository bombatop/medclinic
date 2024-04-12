package courseproject.springbootbackend.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import courseproject.springbootbackend.mapper.JournalMapper;
import courseproject.springbootbackend.mapper.JournalTreatmentMapper;
import courseproject.springbootbackend.model.dto.JournalCreation;
import courseproject.springbootbackend.model.dto.JournalTreatmentCreation;
import courseproject.springbootbackend.model.entity.DoctorEntity;
import courseproject.springbootbackend.model.entity.JournalEntity;
import courseproject.springbootbackend.model.entity.JournalTreatmentEntity;
import courseproject.springbootbackend.model.entity.PatientEntity;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import courseproject.springbootbackend.repository.DoctorRepository;
import courseproject.springbootbackend.repository.JournalRepository;
import courseproject.springbootbackend.repository.PatientRepository;
import courseproject.springbootbackend.repository.JournalTreatmentRepository;
import courseproject.springbootbackend.repository.TreatmentRepository;
import courseproject.springbootbackend.service.exception.DoctorNotFoundException;
import courseproject.springbootbackend.service.exception.EntityAlreadyExistsException;
import courseproject.springbootbackend.service.exception.JournalNotFoundException;
import courseproject.springbootbackend.service.exception.PatientNotFoundException;
import courseproject.springbootbackend.service.exception.TreatmentNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(isolation = Isolation.READ_COMMITTED)
public class JournalService {

    private final JournalRepository journalRepository;

    private final PatientRepository patientRepository;

    private final DoctorRepository doctorRepository;

    private final TreatmentRepository treatmentRepository;

    private final JournalTreatmentRepository journalTreatmentRepository;

    private final JournalMapper journalMapper;

    private final JournalTreatmentMapper journalTreatmentMapper;

    public List<JournalEntity> getAllJournals() {
        return journalRepository.findAll();
    }

    public JournalEntity getJournalById(final Integer id) {
        return journalRepository.findById(id)
                .orElseThrow(JournalNotFoundException::new);
    }
    
    public List<JournalEntity> getJournalsForPatient(final Integer id) {
        patientRepository.findById(id)
                .orElseThrow(PatientNotFoundException::new);
        return journalRepository.findByPatientId(id);
    }

    public List<JournalEntity> getJournalsByDateRange(final Date startDate) {
        try {
            Date endDate = addDaysToDate(startDate, 7);
            return journalRepository.findByDateBetweenOrderByDateAsc(startDate, endDate);
        } 
        catch (Exception e) {
            throw new RuntimeException(e.getMessage()); //change later
        }
    }

    public Date addDaysToDate(final Date startDate, final Integer days) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(startDate);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.add(Calendar.DAY_OF_MONTH, days - 1);
        calendar.add(Calendar.HOUR_OF_DAY, 23);
        calendar.add(Calendar.MINUTE, 59);
        Date endDate = calendar.getTime();
        return endDate;
    }

    public JournalEntity addJournal(final JournalCreation dto) {
        var patientEntity = patientRepository.findById(dto.patientId())
                .orElseThrow(PatientNotFoundException::new);
        var doctorEntity = doctorRepository.findById(dto.doctorId())
                .orElseThrow(DoctorNotFoundException::new);
        var journalEntity = journalMapper.map(dto, patientEntity, doctorEntity);
        try {
            journalEntity = journalRepository.save(journalEntity);
            return journalEntity;
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException(e.getMessage()); //change later
        }
    }

    public JournalEntity updateJournal(final Integer id, final JournalCreation dto) {
        JournalEntity journalEntity = journalRepository.findById(id)
                .orElseThrow(JournalNotFoundException::new);
        PatientEntity patientEntity = patientRepository.findById(dto.patientId())
                .orElseThrow(PatientNotFoundException::new);
        DoctorEntity doctorEntity = doctorRepository.findById(dto.doctorId())
                .orElseThrow(DoctorNotFoundException::new);
        journalEntity.setPatient(patientEntity);
        journalEntity.setDoctor(doctorEntity);
        try {
            journalEntity = journalRepository.save(journalEntity);
            return journalEntity;
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage()); //change later
        }
    }

    public JournalTreatmentEntity addTreatmentToJournal(Integer id, final JournalTreatmentCreation dto) {
        var journalEntity = journalRepository.findById(id)
                .orElseThrow(JournalNotFoundException::new);
        var treatmentEntity = treatmentRepository.findById(dto.treatmentId())
                .orElseThrow(TreatmentNotFoundException::new);
        var journalTreatmentEntity = journalTreatmentMapper.map(dto, journalEntity, treatmentEntity);
        try {
            journalTreatmentEntity = journalTreatmentRepository.save(journalTreatmentEntity);
            return journalTreatmentEntity;
        } catch (DataIntegrityViolationException e) {
            throw new EntityAlreadyExistsException(e.getMessage());
        }
    }

    public List<JournalTreatmentEntity> addTreatmentsToJournal(Integer id, List<JournalTreatmentCreation> dtoList) {
        JournalEntity journalEntity = journalRepository.findById(id).orElseThrow(JournalNotFoundException::new);
        List<JournalTreatmentEntity> journalTreatmentArray = new ArrayList<>();
        for (JournalTreatmentCreation dto : dtoList) {
            var treatmentEntity = treatmentRepository.findById(dto.treatmentId())
                    .orElseThrow(TreatmentNotFoundException::new);
            var journalTreatmentEntity = journalTreatmentMapper.map(dto, journalEntity, treatmentEntity);
            journalTreatmentArray.add(journalTreatmentEntity);
        } 
        try {
            journalTreatmentArray = journalTreatmentRepository.saveAll(journalTreatmentArray);
            return journalTreatmentArray;
        } catch (DataIntegrityViolationException e) {
            throw new EntityAlreadyExistsException(e.getMessage());
        }
    }

    public void deleteJournal(Integer id) {
        // var journalEntity = journalRepository.findById(id);
        journalRepository.deleteById(id);
    }
}
