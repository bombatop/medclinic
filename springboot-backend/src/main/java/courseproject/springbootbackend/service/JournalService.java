package courseproject.springbootbackend.service;

import java.time.LocalDateTime;
import java.util.List;
import courseproject.springbootbackend.mapper.JournalMapper;
import courseproject.springbootbackend.model.dto.JournalCreation;
import courseproject.springbootbackend.model.entity.DoctorEntity;
import courseproject.springbootbackend.model.entity.JournalEntity;
import courseproject.springbootbackend.model.entity.PatientEntity;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import courseproject.springbootbackend.repository.DoctorRepository;
import courseproject.springbootbackend.repository.JournalRepository;
import courseproject.springbootbackend.repository.PatientRepository;
import courseproject.springbootbackend.service.exception.DoctorNotFoundException;
import courseproject.springbootbackend.service.exception.EntityAlreadyExistsException;
import courseproject.springbootbackend.service.exception.JournalNotFoundException;
import courseproject.springbootbackend.service.exception.PatientNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(isolation = Isolation.READ_COMMITTED)
public class JournalService {

    private final JournalRepository journalRepository;

    private final PatientRepository patientRepository;

    private final DoctorRepository doctorRepository;

    private final JournalMapper journalMapper;

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

    public List<JournalEntity> getJournalsByDateRange(final LocalDateTime startDate) {
        try {
            LocalDateTime endDate = startDate.plusDays(7).minusSeconds(1);
            return journalRepository.findByDateBetweenOrderByDateAsc(startDate, endDate);
        } 
        catch (Exception e) {
            throw new RuntimeException(e.getMessage()); //change later
        }
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
        journalEntity.setDate(dto.date());
        try {
            journalEntity = journalRepository.save(journalEntity);
            return journalEntity;
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage()); //change later
        }
    }

    public void deleteJournal(final Integer id) {
        journalRepository.deleteById(id);
    } 
}
