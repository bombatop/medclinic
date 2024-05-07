package courseproject.springbootbackend.service;

import courseproject.springbootbackend.mapper.DiagnosisMapper;
import courseproject.springbootbackend.model.dto.DiagnosisCreation;
import courseproject.springbootbackend.model.entity.DiagnosisEntity;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import courseproject.springbootbackend.repository.DiagnosisRepository;
import courseproject.springbootbackend.service.exception.DiagnosisNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(isolation = Isolation.READ_COMMITTED)
public class DiagnosisService {

    private final DiagnosisRepository diagnosisRepository;

    private final DiagnosisMapper diagnosisMapper;

    public List<DiagnosisEntity> getAllDiagnosis() {
        return diagnosisRepository.findAll();
    }

    public Page<DiagnosisEntity> getAllDiagnosis(final Pageable pageable) {
        return diagnosisRepository.findAll(pageable);
    }

    public Page<DiagnosisEntity> getDiagnosis(final String searchQuery, final Pageable pageable) {
        return diagnosisRepository.findByNameContaining(searchQuery, pageable);
    }

    public DiagnosisEntity getDiagnosisById(final Integer id) {
        return diagnosisRepository.findById(id).orElseThrow(DiagnosisNotFoundException::new);
    }

    public DiagnosisEntity addDiagnosis(final DiagnosisCreation dto) {
        var diagnosisEntity = diagnosisMapper.map(dto);
        try {
            diagnosisEntity = diagnosisRepository.save(diagnosisEntity);
            return diagnosisEntity;
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException(e.getMessage()); // change later
        }
    }

    public DiagnosisEntity updateDiagnosis(final Integer id, DiagnosisCreation dto) {
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