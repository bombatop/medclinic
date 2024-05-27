package courseproject.springbootbackend.service;

import courseproject.springbootbackend.mapper.DiagnosisMapper;
import courseproject.springbootbackend.model.dto.DiagnosisData;
import courseproject.springbootbackend.model.entity.DiagnosisEntity;

import org.springframework.data.domain.Page;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import courseproject.springbootbackend.repository.DiagnosisRepository;
import courseproject.springbootbackend.service.exception.DiagnosisNotFoundException;
import courseproject.springbootbackend.service.specification.DiagnosisSpecification;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(isolation = Isolation.READ_COMMITTED)
public class DiagnosisService {

    private final DiagnosisRepository diagnosisRepository;

    private final DiagnosisMapper diagnosisMapper;

    public Page<DiagnosisEntity> getDiagnoses(final String searchQuery, final Pageable pageable) {
        Specification<DiagnosisEntity> spec = DiagnosisSpecification.getDiagnoses(searchQuery);
        return diagnosisRepository.findAll(spec, pageable);
    }

    public DiagnosisEntity getDiagnosisById(final Integer id) {
        return diagnosisRepository.findById(id).orElseThrow(DiagnosisNotFoundException::new);
    }

    public DiagnosisEntity addDiagnosis(final DiagnosisData dto) {
        var diagnosisEntity = diagnosisMapper.map(dto);
        try {
            diagnosisEntity = diagnosisRepository.save(diagnosisEntity);
            return diagnosisEntity;
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException(e.getMessage()); // change later
        }
    }

    public DiagnosisEntity updateDiagnosis(final Integer id, DiagnosisData dto) {
        var diagnosisEntity = diagnosisRepository.findById(id).orElseThrow(DiagnosisNotFoundException::new);
        diagnosisMapper.updateEntityFromDto(diagnosisEntity, dto);
        try {
            diagnosisEntity = diagnosisRepository.save(diagnosisEntity);
            return diagnosisEntity;
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException(e.getMessage()); // change later
        }
    }

    public void deleteDiagnosis(final Integer id) {
        diagnosisRepository.deleteById(id);
    }
}