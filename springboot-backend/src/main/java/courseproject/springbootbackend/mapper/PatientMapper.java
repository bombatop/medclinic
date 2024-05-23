package courseproject.springbootbackend.mapper;

import org.springframework.stereotype.Component;

import courseproject.springbootbackend.model.dto.PatientCreation;
import courseproject.springbootbackend.model.entity.PatientEntity;

@Component
public class PatientMapper {

    public PatientEntity map(final PatientCreation dto) {
        return PatientEntity.builder()
                .name(dto.name())
                .surname(dto.surname())
                .patronymic(dto.patronymic())
                .phoneNumber(dto.phoneNumber())
                .birthDate(dto.birthDate())
                .build();
    }
}
