package courseproject.springbootbackend.service;

import courseproject.springbootbackend.mapper.JournalTreatmentMapper;
import courseproject.springbootbackend.model.dto.JournalTreatmentCreation;
import courseproject.springbootbackend.model.dto.JournalTreatmentModification;
import courseproject.springbootbackend.model.entity.JournalEntity;
import courseproject.springbootbackend.model.entity.JournalTreatmentEntity;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import courseproject.springbootbackend.repository.JournalRepository;
import courseproject.springbootbackend.repository.JournalTreatmentRepository;
import courseproject.springbootbackend.repository.TreatmentRepository;
import courseproject.springbootbackend.service.exception.EntityAlreadyExistsException;
import courseproject.springbootbackend.service.exception.JournalNotFoundException;
import courseproject.springbootbackend.service.exception.JournalTreatmentNotFoundException;
import courseproject.springbootbackend.service.exception.TreatmentNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(isolation = Isolation.READ_COMMITTED)
public class JournalTreatmentService {
    
    private final JournalRepository journalRepository;

    private final TreatmentRepository treatmentRepository;

    private final JournalTreatmentRepository journalTreatmentRepository;

    private final JournalTreatmentMapper journalTreatmentMapper;

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
}