package courseproject.springbootbackend.mapper;

import org.springframework.stereotype.Component;

import courseproject.springbootbackend.model.dto.JournalDiagnosisCreation;
import courseproject.springbootbackend.model.entity.DiagnosisEntity;
import courseproject.springbootbackend.model.entity.JournalDiagnosisEntity;

@Component
public class JournalDiagnosisMapper {

    public JournalDiagnosisEntity map(final JournalDiagnosisCreation dto,
            final DiagnosisEntity diagnosisEntity) {
        return JournalDiagnosisEntity.builder()
                .diagnosis(diagnosisEntity)
                .toothcodes(dto.toothcodes())
                .build();
    }
}
