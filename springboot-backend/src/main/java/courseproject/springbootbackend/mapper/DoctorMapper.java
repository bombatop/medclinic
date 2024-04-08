package courseproject.springbootbackend.mapper;

import org.springframework.stereotype.Component;

import courseproject.springbootbackend.model.dto.DoctorCreation;
import courseproject.springbootbackend.model.entity.DoctorEntity;

@Component
public class DoctorMapper {

    public DoctorEntity map(final DoctorCreation dto) {
        return DoctorEntity.builder()
                .name(dto.name())
                .phoneNumber(dto.phoneNumber())
                .build();
    }
}
