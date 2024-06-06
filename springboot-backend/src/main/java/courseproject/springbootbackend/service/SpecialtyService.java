package courseproject.springbootbackend.service;

import courseproject.springbootbackend.mapper.SpecialtyMapper;
import courseproject.springbootbackend.model.dto.SpecialtyData;
import courseproject.springbootbackend.model.entity.SpecialtyEntity;

import org.springframework.data.domain.Page;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import courseproject.springbootbackend.repository.SpecialtyRepository;
import courseproject.springbootbackend.service.exception.SpecialtyNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(isolation = Isolation.READ_COMMITTED)
public class SpecialtyService {

    private final SpecialtyRepository specialtyRepository;

    private final SpecialtyMapper specialtyMapper;

    public Page<SpecialtyEntity> getSpecialties(final String searchQuery, final Pageable pageable) {
        return specialtyRepository.findByNameContaining(searchQuery, pageable);
    }

    public SpecialtyEntity getSpecialtyById(final Integer id) {
        return specialtyRepository.findById(id).orElseThrow(SpecialtyNotFoundException::new);
    }

    public SpecialtyEntity addSpecialty(final SpecialtyData dto) {
        var specialtyEntity = specialtyMapper.map(dto);
        try {
            specialtyEntity = specialtyRepository.save(specialtyEntity);
            return specialtyEntity;
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException(e.getMessage()); // change later
        }
    }

    public SpecialtyEntity updateSpecialty(final Integer id, SpecialtyData dto) {
        var specialtyEntity = specialtyRepository.findById(id).orElseThrow(SpecialtyNotFoundException::new);
        specialtyMapper.updateEntityFromDto(specialtyEntity, dto);
        try {
            specialtyEntity = specialtyRepository.save(specialtyEntity);
            return specialtyEntity;
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException(e.getMessage()); // change later
        }
    }

    public void deleteSpecialty(final Integer id) {
        specialtyRepository.deleteById(id);
    }
}