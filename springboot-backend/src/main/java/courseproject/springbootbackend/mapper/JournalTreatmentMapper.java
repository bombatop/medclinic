package courseproject.springbootbackend.mapper;

import org.springframework.stereotype.Component;

import courseproject.springbootbackend.model.dto.JournalTreatmentCreation;
import courseproject.springbootbackend.model.entity.JournalTreatmentEntity;
import courseproject.springbootbackend.model.entity.TreatmentEntity;

@Component
public class JournalTreatmentMapper {

    public JournalTreatmentEntity map(final JournalTreatmentCreation dto,
        final Integer journalId,
        final TreatmentEntity treatmentEntity) {
        return JournalTreatmentEntity.builder()
                // .journal(journalEntity)
                .treatment(treatmentEntity)
                .journalId(journalId)
                .amount(dto.amount())
                .build();
    }
}
