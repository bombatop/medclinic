package courseproject.springbootbackend.service;

import java.util.Date;
import java.util.List;

import courseproject.springbootbackend.mapper.PriceMapper;
import courseproject.springbootbackend.model.dto.PriceData;
import courseproject.springbootbackend.model.entity.PriceEntity;
import courseproject.springbootbackend.model.entity.AgencyEntity;
import courseproject.springbootbackend.model.entity.TreatmentEntity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import courseproject.springbootbackend.repository.AgencyRepository;
import courseproject.springbootbackend.repository.PriceRepository;
import courseproject.springbootbackend.repository.TreatmentRepository;
import courseproject.springbootbackend.service.exception.TreatmentNotFoundException;
import courseproject.springbootbackend.service.specification.PriceSpecification;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(isolation = Isolation.READ_COMMITTED)
public class PriceService {
    
    private final PriceRepository priceRepository;
    
    private final TreatmentRepository treatmentRepository;

    private final AgencyRepository agencyRepository;

    private final PriceMapper priceMapper;

    public Page<PriceEntity> getPrices(Pageable pageable, Integer treatmentId, Integer agencyId, Boolean latestOnly) {
        Specification<PriceEntity> spec = PriceSpecification.pricesByAgencyAndTreatment(treatmentId, agencyId, latestOnly);
        return priceRepository.findAll(spec, pageable);
    }

    public PriceEntity getPriceForTreatmentAndDate(TreatmentEntity t, Date d) {
        return priceRepository.findPriceByTreatmentAndDate(t, d);
    }

    public List<PriceEntity> getPricesByTreatmentId(Integer id) {
        return priceRepository.findByTreatmentIdOrderByDateDesc(id);
    }

    public PriceEntity addPriceForTreatment(PriceData dto) {
        TreatmentEntity treatmentEntity = treatmentRepository.findById(dto.treatmentId())
                .orElseThrow(TreatmentNotFoundException::new);
        AgencyEntity agencyEntity = agencyRepository.findById(dto.agencyId())
                .orElseThrow(TreatmentNotFoundException::new);
        PriceEntity priceEntity = priceMapper.map(dto, treatmentEntity, agencyEntity);
        priceEntity = priceRepository.save(priceEntity);
        return priceEntity;
    }

    public void deletePrice(Integer id) {
        priceRepository.deleteById(id);
    }
}   