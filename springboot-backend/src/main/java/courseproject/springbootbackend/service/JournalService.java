package courseproject.springbootbackend.service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import courseproject.springbootbackend.mapper.JournalMapper;
import courseproject.springbootbackend.mapper.JournalTreatmentMapper;
import courseproject.springbootbackend.model.dto.JournalCreation;
import courseproject.springbootbackend.model.dto.JournalTreatmentCreation;
import courseproject.springbootbackend.model.dto.JournalTreatmentModification;
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
import courseproject.springbootbackend.service.exception.JournalTreatmentNotFoundException;
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
            throw new EntityAlreadyExistsException(e.getMessage());
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

    public void existsJournalTreatment(final Integer journal, final Integer treatment) {
        if (journalRepository.existsJournalTreatmentInJournal(journal, treatment)) {
            throw new EntityAlreadyExistsException("The treatment is already associated with this journal.");
        }
    }

    public JournalTreatmentEntity addTreatmentToJournal(final Integer journalId, final JournalTreatmentCreation dto) {
        var journalEntity = journalRepository.findById(journalId)
                .orElseThrow(JournalNotFoundException::new);
        var treatmentEntity = treatmentRepository.findById(dto.treatmentId())
                .orElseThrow(TreatmentNotFoundException::new);
        existsJournalTreatment(journalId, dto.treatmentId());
        var journalTreatmentEntity = journalTreatmentMapper.map(dto, treatmentEntity);
        try {
            journalTreatmentEntity = journalTreatmentRepository.save(journalTreatmentEntity);
            journalEntity.getTreatments().add(journalTreatmentEntity);
            journalEntity = journalRepository.save(journalEntity);
            return journalTreatmentEntity;
        } catch (DataIntegrityViolationException e) {
            throw new EntityAlreadyExistsException(e.getMessage());
        }
    }

    public JournalTreatmentEntity updateTreatmentOfJournal(final Integer journalId, final Integer treatmentId,
            final JournalTreatmentModification dto) {
        var journalEntity = journalRepository.findById(journalId)
                .orElseThrow(JournalNotFoundException::new);
        var journalTreatmentEntity = journalTreatmentRepository.findById(treatmentId)
                .orElseThrow(JournalTreatmentNotFoundException::new);
        try {
            if (dto.amount() == 0) {
                journalEntity.getTreatments().remove(journalTreatmentEntity);
                journalTreatmentRepository.delete(journalTreatmentEntity); 
                journalRepository.save(journalEntity);
                return null;
            } else {
                journalTreatmentEntity.setAmount(dto.amount());
                journalTreatmentEntity = journalTreatmentRepository.save(journalTreatmentEntity);
                journalEntity.getTreatments().add(journalTreatmentEntity);
                journalEntity = journalRepository.save(journalEntity);
                return journalTreatmentEntity;
            }
        } catch (DataIntegrityViolationException e) {
            throw new EntityAlreadyExistsException(e.getMessage());
        }
    }
    
    public void deleteJournalTreatment(final Integer journalId, final Integer treatmentId) {
        JournalEntity journal = journalRepository.findById(journalId)
                .orElseThrow(JournalNotFoundException::new);
        JournalTreatmentEntity treatment = journalTreatmentRepository.findById(treatmentId)
                .orElseThrow(JournalTreatmentNotFoundException::new);
        journal.getTreatments().remove(treatment);
        journalRepository.save(journal);
        journalTreatmentRepository.delete(treatment);
    }


    public void deleteJournal(final Integer id) {
        journalRepository.deleteById(id);
    }
}
