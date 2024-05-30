package courseproject.springbootbackend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.time.temporal.ChronoUnit;
import java.time.format.DateTimeFormatter;

import courseproject.springbootbackend.mapper.JournalMapper;
import courseproject.springbootbackend.model.dto.JournalData;
import courseproject.springbootbackend.model.dto.JournalLinkData;
import courseproject.springbootbackend.model.entity.DoctorEntity;
import courseproject.springbootbackend.model.entity.JournalEntity;
import courseproject.springbootbackend.model.entity.PatientEntity;
import courseproject.springbootbackend.model.entity.misc.JournalStatus;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import courseproject.springbootbackend.repository.DoctorRepository;
import courseproject.springbootbackend.repository.JournalRepository;
import courseproject.springbootbackend.repository.PatientRepository;
import courseproject.springbootbackend.service.exception.DoctorNotFoundException;
import courseproject.springbootbackend.service.exception.EntityAlreadyExistsException;
import courseproject.springbootbackend.service.exception.JournalAlreadyLinkedException;
import courseproject.springbootbackend.service.exception.JournalNotFoundException;
import courseproject.springbootbackend.service.exception.PatientNotFoundException;
import courseproject.springbootbackend.service.specification.JournalSpecification;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(isolation = Isolation.READ_COMMITTED)
public class JournalService {

    private final JournalRepository journalRepository;

    private final PatientRepository patientRepository;

    private final DoctorRepository doctorRepository;

    private final JournalMapper journalMapper;

    public Page<JournalEntity> getJournals(Pageable pageable, Integer doctorId, Integer patientId, JournalStatus status, String startDateStr, String endDateStr) {
        LocalDateTime start = startDateStr != null
            ? LocalDateTime.parse(startDateStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME).truncatedTo(ChronoUnit.DAYS)
            : null;

        LocalDateTime end = endDateStr != null
            ? LocalDateTime.parse(endDateStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME).truncatedTo(ChronoUnit.DAYS).plusDays(1).minusSeconds(1)
            : null;

        Specification<JournalEntity> spec = JournalSpecification.getJournals(doctorId, patientId, status, start, end);
        return journalRepository.findAll(spec, pageable);
    }

    public JournalEntity getJournalById(final Integer id) {
        return journalRepository.findById(id)
                .orElseThrow(JournalNotFoundException::new);
    }

    public JournalEntity addJournal(final JournalData dto) {
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

    // not used so far
    public JournalEntity addJournalAndLinkJournalEntry(final JournalLinkData dto) {
        var currentJournalEntity = journalRepository.findById(dto.prevEntryId())
                .orElseThrow(JournalNotFoundException::new);
        if (currentJournalEntity.getNextEntry() != null) {
            throw new JournalAlreadyLinkedException("Current entry already has a next entry.");
        }

        var patientEntity = patientRepository.findById(dto.patientId())
                .orElseThrow(PatientNotFoundException::new);
        var doctorEntity = doctorRepository.findById(dto.doctorId())
                .orElseThrow(DoctorNotFoundException::new);
        var nextJournalEntity = journalMapper.map(dto, patientEntity, doctorEntity, currentJournalEntity);

        currentJournalEntity.setNextEntry(nextJournalEntity);
        try {
            nextJournalEntity = journalRepository.save(nextJournalEntity);
            currentJournalEntity = journalRepository.save(currentJournalEntity);
            return nextJournalEntity;
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage()); //change later
        }
    }

    public void linkNextEntry(final Integer currentEntryId, final Integer nextEntryId) {
        var currentJournalEntity = journalRepository.findById(currentEntryId)
                .orElseThrow(JournalNotFoundException::new);
        var nextJournalEntity = journalRepository.findById(nextEntryId)
                .orElseThrow(JournalNotFoundException::new);

        if (currentJournalEntity.getNextEntry() != null) {
            throw new JournalAlreadyLinkedException("Current entry already has a next entry.");
        }
        if (nextJournalEntity.getPrevEntry() != null) {
            throw new JournalAlreadyLinkedException("Next entry already has a previous entry.");
        }

        currentJournalEntity.setNextEntry(nextJournalEntity);
        nextJournalEntity.setPrevEntry(currentJournalEntity);

        journalRepository.save(nextJournalEntity);
        journalRepository.save(currentJournalEntity);
    }

    public void unlinkNextEntry(final Integer currentEntryId) {
        var currentJournalEntity = journalRepository.findById(currentEntryId)
                .orElseThrow(JournalNotFoundException::new);

        var nextJournalEntity = currentJournalEntity.getNextEntry();
        if (nextJournalEntity == null) {
            throw new JournalAlreadyLinkedException("No next entry linked to the current entry.");
        }

        currentJournalEntity.setNextEntry(null);
        nextJournalEntity.setPrevEntry(null);

        journalRepository.save(nextJournalEntity);
        journalRepository.save(currentJournalEntity);
    }

    public List<JournalEntity> getAvailableNextEntries(final Integer journalId) {
        var journalEntity = journalRepository.findById(journalId)
                .orElseThrow(JournalNotFoundException::new);
        return journalRepository.findNextEntry(
                journalEntity.getDate(), 
                journalEntity.getPatient().getId(),
                journalEntity.getId()
        );
    }

    public List<JournalEntity> getAvailablePreviousEntries(final Integer journalId) {
        var journalEntity = journalRepository.findById(journalId)
                .orElseThrow(JournalNotFoundException::new);
        return journalRepository.findPreviousEntry(
                journalEntity.getDate(),
                journalEntity.getPatient().getId(),
                journalEntity.getId()
        );
    }

    public JournalEntity updateJournal(final Integer id, final JournalData dto) {
        JournalEntity journalEntity = journalRepository.findById(id)
                .orElseThrow(JournalNotFoundException::new);
        PatientEntity patientEntity = patientRepository.findById(dto.patientId())
                .orElseThrow(PatientNotFoundException::new);
        DoctorEntity doctorEntity = doctorRepository.findById(dto.doctorId())
                .orElseThrow(DoctorNotFoundException::new);
        if (!journalEntity.getPatient().equals(patientEntity)) {
            throw new JournalAlreadyLinkedException("Can't change patient for a linked journal");
        }
        journalEntity.setPatient(patientEntity);
        journalEntity.setDoctor(doctorEntity);
        journalEntity.setDate(dto.date());
        journalEntity.setTimeEnd(dto.timeEnd());
        journalEntity.setStatus(dto.status());
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
