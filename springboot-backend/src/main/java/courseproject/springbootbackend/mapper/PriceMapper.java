package courseproject.springbootbackend.mapper;

import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import courseproject.springbootbackend.model.dto.PriceData;
import courseproject.springbootbackend.model.dto.TreatmentPriceData;
import courseproject.springbootbackend.model.entity.AgencyEntity;
import courseproject.springbootbackend.model.entity.PriceEntity;
import courseproject.springbootbackend.model.entity.TreatmentEntity;

@Component
public class PriceMapper {

    public PriceEntity map(
        final PriceData dto,
        TreatmentEntity treatmentEntity,
        AgencyEntity agencyEntity
    ) {
        return PriceEntity.builder()
                .date(dto.date())
                .price(dto.price())
                .treatment(treatmentEntity)
                .agency(agencyEntity)
                .build();
    }

    public PriceEntity map(
        TreatmentPriceData treatmentPriceData,
        LocalDateTime date,
        TreatmentEntity treatmentEntity,
        AgencyEntity agencyEntity
    ) {
        return PriceEntity.builder()
                .price(treatmentPriceData.price())
                .date(date)
                .agency(agencyEntity)
                .treatment(treatmentEntity)
                .build();
    }
}