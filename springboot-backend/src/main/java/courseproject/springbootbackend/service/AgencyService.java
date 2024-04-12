package courseproject.springbootbackend.service;

import courseproject.springbootbackend.mapper.AgencyMapper;
import courseproject.springbootbackend.model.dto.AgencyCreation;
import courseproject.springbootbackend.model.entity.AgencyEntity;

import java.util.List;

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

    public List<AgencyEntity> getAllAgencies() {
        return agencyRepository.findAll();
    }

    public Page<AgencyEntity> getAllAgencies(final Pageable pageable) {
        return agencyRepository.findAll(pageable);
    }

    public Page<AgencyEntity> getAgencies(final String searchQuery, final Pageable pageable) {
        return agencyRepository.findByNameContaining(searchQuery, pageable);
    }

    public AgencyEntity getAgencyById(final Integer id) {
        return agencyRepository.findAgencyById(id);
    }

    public AgencyEntity addAgency(final AgencyCreation dto) {
        var agencyEntity = agencyMapper.map(dto);
        try {
            agencyEntity = agencyRepository.save(agencyEntity);
            return agencyEntity;
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException(e.getMessage()); // change later
        }
    }

    public AgencyEntity updateAgency(final Integer id, AgencyCreation dto) {
        var agencyEntity = agencyRepository.findById(id).orElseThrow(AgencyNotFoundException::new);
        agencyEntity.setName(dto.name());
        agencyEntity.setLoadedByDefault(dto.loadedByDefault());
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