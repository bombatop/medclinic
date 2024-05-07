package courseproject.springbootbackend.mapper;

import org.springframework.stereotype.Component;

import courseproject.springbootbackend.model.dto.DiagnosisCreation;
import courseproject.springbootbackend.model.entity.DiagnosisEntity;

@Component
public class DiagnosisMapper {

    public DiagnosisEntity map(final DiagnosisCreation dto) {
        return DiagnosisEntity.builder()
                .name(dto.name())
                .icdCode(dto.icdCode())
                .build();
    }

    public void updateEntityFromDto(final DiagnosisEntity entity, final DiagnosisCreation dto) {
        entity.setName(dto.name());
        entity.setIcdCode(dto.icdCode());
    }
}