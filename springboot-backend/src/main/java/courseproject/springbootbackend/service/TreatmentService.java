package courseproject.springbootbackend.service;

import courseproject.springbootbackend.mapper.TreatmentMapper;
import courseproject.springbootbackend.model.dto.TreatmentCreation;
import courseproject.springbootbackend.model.entity.TreatmentEntity;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import courseproject.springbootbackend.repository.TreatmentRepository;
import courseproject.springbootbackend.service.exception.TreatmentNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(isolation = Isolation.READ_COMMITTED)
public class TreatmentService {

    private final TreatmentRepository treatmentRepository;

    private final TreatmentMapper treatmentMapper;

    public List<TreatmentEntity> getAllTreatments() {
        return treatmentRepository.findAll();
    }

    public Page<TreatmentEntity> getAllTreatments(final Pageable pageable) {
        return treatmentRepository.findAll(pageable);
    }

    public Page<TreatmentEntity> getTreatments(final String searchQuery, final Pageable pageable) {
        return treatmentRepository.findByNameContaining(searchQuery, pageable);
    }

    public TreatmentEntity getTreatmentById(final Integer id) {
        return treatmentRepository.findById(id).orElseThrow(TreatmentNotFoundException::new);
    }

    public TreatmentEntity addTreatment(final TreatmentCreation dto) {
        var treatmentEntity = treatmentMapper.map(dto);
        try {
            treatmentEntity = treatmentRepository.save(treatmentEntity);
            return treatmentEntity;
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException(e.getMessage()); // change later
        }
    }

    public TreatmentEntity updateTreatment(final Integer id, TreatmentCreation dto) {
        var treatmentEntity = treatmentRepository.findById(id).orElseThrow(TreatmentNotFoundException::new);
        treatmentEntity.setName(dto.name());
        try {
            treatmentEntity = treatmentRepository.save(treatmentEntity);
            return treatmentEntity;
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException(e.getMessage()); // change later
        }
    }

    public void deleteTreatment(final Integer id) {
        treatmentRepository.deleteById(id);
    }
}