package courseproject.springbootbackend.mapper;

import org.springframework.stereotype.Component;

import courseproject.springbootbackend.model.dto.JournalCreation;
import courseproject.springbootbackend.model.entity.DoctorEntity;
import courseproject.springbootbackend.model.entity.JournalEntity;
import courseproject.springbootbackend.model.entity.PatientEntity;

@Component
public class JournalMapper {

    public JournalEntity map(final JournalCreation dto, 
        final PatientEntity patientEntity,
        final DoctorEntity doctorEntity) {
        return JournalEntity.builder()
                .date(dto.date())
                .patient(patientEntity)
                .doctor(doctorEntity)
                .build();
    }
}