package courseproject.springbootbackend.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import courseproject.springbootbackend.mapper.PriceMapper;
import courseproject.springbootbackend.model.dto.BulkPriceUpdateData;
import courseproject.springbootbackend.model.dto.PriceData;
import courseproject.springbootbackend.model.dto.TreatmentPriceData;
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
import courseproject.springbootbackend.service.exception.AgencyNotFoundException;
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

    public PriceEntity getPriceForTreatmentAndDate(final TreatmentEntity t, final Date d) {
        return priceRepository.findPriceByTreatmentAndDate(t, d);
    }

    public List<PriceEntity> getPricesByTreatmentId(final Integer id) {
        return priceRepository.findByTreatmentIdOrderByDateDesc(id);
    }

    public PriceEntity addPriceForTreatment(final PriceData dto) {
        TreatmentEntity treatmentEntity = treatmentRepository.findById(dto.treatmentId())
                .orElseThrow(TreatmentNotFoundException::new);
        AgencyEntity agencyEntity = agencyRepository.findById(dto.agencyId())
                .orElseThrow(TreatmentNotFoundException::new);
        PriceEntity priceEntity = priceMapper.map(dto, treatmentEntity, agencyEntity);
        priceEntity = priceRepository.save(priceEntity);
        return priceEntity;
    }

    public List<PriceEntity> bulkUpdatePrices(final BulkPriceUpdateData dto) {
        AgencyEntity agencyEntity = agencyRepository.findById(dto.agencyId())
                .orElseThrow(AgencyNotFoundException::new);

        List<PriceEntity> priceEntities = new ArrayList<>();

        for (TreatmentPriceData treatmentPriceData : dto.prices()) {
            TreatmentEntity treatmentEntity = treatmentRepository.findById(treatmentPriceData.treatmentId())
                    .orElseThrow(TreatmentNotFoundException::new);
            PriceEntity priceEntity = priceMapper.map(treatmentPriceData, dto.date(), treatmentEntity, agencyEntity);
            priceEntities.add(priceEntity);
        }

        return priceRepository.saveAll(priceEntities);
    }

    public void deletePrice(Integer id) {
        priceRepository.deleteById(id);
    }
}   