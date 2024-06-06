package courseproject.springbootbackend.mapper;

import org.springframework.stereotype.Component;

import courseproject.springbootbackend.model.dto.SpecialtyData;
import courseproject.springbootbackend.model.entity.SpecialtyEntity;

@Component
public class SpecialtyMapper {

    public SpecialtyEntity map(final SpecialtyData dto) {
        return SpecialtyEntity.builder()
                .name(dto.name())
                .build();
    }

    public void updateEntityFromDto(final SpecialtyEntity entity, final SpecialtyData dto) {
        entity.setName(dto.name());
    }
}
