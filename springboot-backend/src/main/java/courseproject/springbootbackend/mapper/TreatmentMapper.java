package courseproject.springbootbackend.mapper;

import org.springframework.stereotype.Component;

import courseproject.springbootbackend.model.dto.TreatmentCreation;
import courseproject.springbootbackend.model.entity.TreatmentEntity;

@Component
public class TreatmentMapper {

    public TreatmentEntity map(final TreatmentCreation dto) {
        return TreatmentEntity.builder()
                .name(dto.name())
                .build();
    }
}