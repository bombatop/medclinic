package courseproject.springbootbackend.mapper;

import org.springframework.stereotype.Component;

import courseproject.springbootbackend.model.dto.DiagnosisData;
import courseproject.springbootbackend.model.entity.DiagnosisEntity;

@Component
public class DiagnosisMapper {

    public DiagnosisEntity map(final DiagnosisData dto) {
        return DiagnosisEntity.builder()
                .name(dto.name())
                .code(dto.code())
                .build();
    }

    public void updateEntityFromDto(final DiagnosisEntity entity, final DiagnosisData dto) {
        entity.setName(dto.name());
        entity.setCode(dto.code());
    }
}