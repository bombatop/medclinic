package courseproject.springbootbackend.service;

import courseproject.springbootbackend.mapper.JournalDiagnosisMapper;
import courseproject.springbootbackend.model.dto.JournalDiagnosisCreation;
import courseproject.springbootbackend.model.dto.JournalDiagnosisModification;
import courseproject.springbootbackend.model.entity.JournalEntity;
import courseproject.springbootbackend.model.entity.JournalDiagnosisEntity;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import courseproject.springbootbackend.repository.JournalRepository;
import courseproject.springbootbackend.repository.JournalDiagnosisRepository;
import courseproject.springbootbackend.repository.DiagnosisRepository;
import courseproject.springbootbackend.service.exception.EntityAlreadyExistsException;
import courseproject.springbootbackend.service.exception.JournalNotFoundException;
import courseproject.springbootbackend.service.exception.JournalDiagnosisNotFoundException;
import courseproject.springbootbackend.service.exception.DiagnosisNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(isolation = Isolation.READ_COMMITTED)
public class JournalDiagnosisService {

    private final JournalRepository journalRepository;

    private final DiagnosisRepository diagnosisRepository;

    private final JournalDiagnosisRepository journalDiagnosisRepository;

    private final JournalDiagnosisMapper journalDiagnosisMapper;

    public void existsJournalDiagnosis(final Integer journal, final Integer diagnosis) {
        if (journalRepository.existsJournalDiagnosisInJournal(journal, diagnosis)) {
            throw new EntityAlreadyExistsException("The diagnosis is already associated with this journal.");
        }
    }

    public JournalDiagnosisEntity addDiagnosisToJournal(final Integer journalId, final JournalDiagnosisCreation dto) {
        var journalEntity = journalRepository.findById(journalId)
                .orElseThrow(JournalNotFoundException::new);
        var diagnosisEntity = diagnosisRepository.findById(dto.diagnosisId())
                .orElseThrow(DiagnosisNotFoundException::new);
        existsJournalDiagnosis(journalId, dto.diagnosisId());
        var journalDiagnosisEntity = journalDiagnosisMapper.map(dto, diagnosisEntity);
        try {
            journalDiagnosisEntity = journalDiagnosisRepository.save(journalDiagnosisEntity);
            journalEntity.getDiagnoses().add(journalDiagnosisEntity);
            journalEntity = journalRepository.save(journalEntity);
            return journalDiagnosisEntity;
        } catch (DataIntegrityViolationException e) {
            throw new EntityAlreadyExistsException(e.getMessage());
        }
    }
    
    public JournalDiagnosisEntity updateDiagnosisOfJournal(final Integer journalId, final Integer diagnosisId,
            final JournalDiagnosisModification dto) {
        var journalDiagnosisEntity = journalDiagnosisRepository.findById(diagnosisId)
                .orElseThrow(JournalDiagnosisNotFoundException::new);
        try {
            journalDiagnosisEntity.setToothcodes(dto.toothcodes());
            journalDiagnosisEntity = journalDiagnosisRepository.save(journalDiagnosisEntity);
            return journalDiagnosisEntity;
        } catch (DataIntegrityViolationException e) {
            throw new EntityAlreadyExistsException(e.getMessage());
        }
    }


    public void deleteJournalDiagnosis(final Integer journalId, final Integer diagnosisId) {
        JournalEntity journal = journalRepository.findById(journalId)
                .orElseThrow(JournalNotFoundException::new);
        JournalDiagnosisEntity diagnosis = journalDiagnosisRepository.findById(diagnosisId)
                .orElseThrow(JournalDiagnosisNotFoundException::new);
        journal.getDiagnoses().remove(diagnosis);
        journalRepository.save(journal);
        journalDiagnosisRepository.delete(diagnosis);
    }
}