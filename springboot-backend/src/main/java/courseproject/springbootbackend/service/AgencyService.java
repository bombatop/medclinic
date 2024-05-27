package courseproject.springbootbackend.service;

import courseproject.springbootbackend.mapper.AgencyMapper;
import courseproject.springbootbackend.model.dto.AgencyData;
import courseproject.springbootbackend.model.entity.AgencyEntity;

import org.springframework.data.domain.Page;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import courseproject.springbootbackend.repository.AgencyRepository;
import courseproject.springbootbackend.service.exception.AgencyNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(isolation = Isolation.READ_COMMITTED)
public class AgencyService {

    private final AgencyRepository agencyRepository;

    private final AgencyMapper agencyMapper;

    public Page<AgencyEntity> getAgencies(final String searchQuery, final Pageable pageable) {
        return agencyRepository.findByNameContaining(searchQuery, pageable);
    }

    public AgencyEntity getAgencyById(final Integer id) {
        return agencyRepository.findById(id).orElseThrow(AgencyNotFoundException::new);
    }

    public AgencyEntity addAgency(final AgencyData dto) {
        var agencyEntity = agencyMapper.map(dto);
        try {
            agencyEntity = agencyRepository.save(agencyEntity);
            return agencyEntity;
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException(e.getMessage()); // change later
        }
    }

    public AgencyEntity updateAgency(final Integer id, AgencyData dto) {
        var agencyEntity = agencyRepository.findById(id).orElseThrow(AgencyNotFoundException::new);
        agencyMapper.updateEntityFromDto(agencyEntity, dto);
        try {
            agencyEntity = agencyRepository.save(agencyEntity);
            return agencyEntity;
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException(e.getMessage()); // change later
        }
    }

    public void deleteAgency(final Integer id) {
        agencyRepository.deleteById(id);
    }
}