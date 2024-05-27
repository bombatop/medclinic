package courseproject.springbootbackend.mapper;

import org.springframework.stereotype.Component;

import courseproject.springbootbackend.model.dto.TreatmentCreation;
import courseproject.springbootbackend.model.entity.TreatmentEntity;

@Component
public class TreatmentMapper {

    public TreatmentEntity map(final TreatmentCreation dto) {
        return TreatmentEntity.builder()
                .name(dto.name())
                .code(dto.code())
                .build();
    }

    public void updateEntityFromDto(final TreatmentEntity entity, final TreatmentCreation dto) {
        entity.setName(dto.name());
        entity.setCode(dto.code());
    }
}