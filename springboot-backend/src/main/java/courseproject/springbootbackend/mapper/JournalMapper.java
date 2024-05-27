package courseproject.springbootbackend.mapper;

import org.springframework.stereotype.Component;

import courseproject.springbootbackend.model.dto.JournalData;
import courseproject.springbootbackend.model.dto.JournalLinkData;
import courseproject.springbootbackend.model.entity.DoctorEntity;
import courseproject.springbootbackend.model.entity.JournalEntity;
import courseproject.springbootbackend.model.entity.PatientEntity;

@Component
public class JournalMapper {

    public JournalEntity map(final JournalData dto, 
        final PatientEntity patientEntity,
        final DoctorEntity doctorEntity) {
        return JournalEntity.builder()
                .patient(patientEntity)
                .doctor(doctorEntity)
                .status(dto.status())
                .date(dto.date())
                .timeEnd(dto.timeEnd())
                .build();
    }

    // not used
    public JournalEntity map(final JournalLinkData dto,
            final PatientEntity patientEntity,
            final DoctorEntity doctorEntity,
            final JournalEntity prevJournalEntity) {
        return JournalEntity.builder()
                .patient(patientEntity)
                .doctor(doctorEntity)
                .previousEntry(prevJournalEntity)
                .date(dto.date())
                .timeEnd(dto.timeEnd())
                .build();
    }
}