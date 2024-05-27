package courseproject.springbootbackend.mapper;

import org.springframework.stereotype.Component;

import courseproject.springbootbackend.model.dto.AgencyData;
import courseproject.springbootbackend.model.entity.AgencyEntity;

@Component
public class AgencyMapper {

    public AgencyEntity map(final AgencyData dto) {
        return AgencyEntity.builder()
                .name(dto.name())
                // .loadedByDefault(dto.loadedByDefault())
                .build();
    }

    public void updateEntityFromDto(final AgencyEntity entity, final AgencyData dto) {
        entity.setName(dto.name());
        // entity.setLoadedByDefault(dto.loadedByDefault());
    }
}
