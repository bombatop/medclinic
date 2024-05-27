package courseproject.springbootbackend.service;

import courseproject.springbootbackend.mapper.TreatmentMapper;
import courseproject.springbootbackend.model.dto.TreatmentCreation;
import courseproject.springbootbackend.model.entity.TreatmentEntity;

import org.springframework.data.domain.Page;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import courseproject.springbootbackend.repository.TreatmentRepository;
import courseproject.springbootbackend.service.exception.TreatmentNotFoundException;
import courseproject.springbootbackend.service.specification.TreatmentSpecification;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(isolation = Isolation.READ_COMMITTED)
public class TreatmentService {

    private final TreatmentRepository treatmentRepository;

    private final TreatmentMapper treatmentMapper;

    public Page<TreatmentEntity> getTreatments(final String searchQuery, final Pageable pageable) {
        Specification<TreatmentEntity> spec = TreatmentSpecification.getTreatments(searchQuery);
        return treatmentRepository.findAll(spec, pageable);
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
        treatmentMapper.updateEntityFromDto(treatmentEntity, dto);
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