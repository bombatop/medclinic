package courseproject.springbootbackend.mapper;

import org.springframework.stereotype.Component;

import courseproject.springbootbackend.model.dto.AgencyCreation;
import courseproject.springbootbackend.model.entity.AgencyEntity;

@Component
public class AgencyMapper {

    public AgencyEntity map(final AgencyCreation dto) {
        return AgencyEntity.builder()
                .name(dto.name())
                .loadedByDefault(dto.loadedByDefault())
                .build();
    }
}
