package courseproject.springbootbackend.mapper;

import org.springframework.stereotype.Component;

import courseproject.springbootbackend.model.dto.PatientData;
import courseproject.springbootbackend.model.entity.PatientEntity;

@Component
public class PatientMapper {

    public PatientEntity map(final PatientData dto) {
        return PatientEntity.builder()
                .name(dto.name())
                .surname(dto.surname())
                .patronymic(dto.patronymic())
                .phoneNumber(dto.phoneNumber())
                .birthDate(dto.birthDate())
                .build();
    }

    public void updateEntityFromDto(final PatientEntity entity, final PatientData dto) {
        entity.setName(dto.name());
        entity.setSurname(dto.surname());
        entity.setPatronymic(dto.patronymic());
        entity.setPhoneNumber(dto.phoneNumber());
        entity.setBirthDate(dto.birthDate());
    }
}
