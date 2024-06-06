package courseproject.springbootbackend.model.dto;

import java.util.List;
import java.util.Map;

import courseproject.springbootbackend.model.entity.JournalDiagnosisEntity;
import courseproject.springbootbackend.model.entity.PatientEntity;
import courseproject.springbootbackend.model.entity.TreatmentEntity;
import courseproject.springbootbackend.model.entity.UserEntity;
import lombok.Data;

@Data
public class JournalReportDTO {
    private PatientEntity patient;
    private List<UserEntity> doctors;
    private List<JournalDiagnosisEntity> diagnoses;
    private List<JournalTreatmentReportDTO> treatments;

    @Data
    public static class JournalTreatmentReportDTO {
        private TreatmentEntity treatment;
        private int amount;
        private Map<Integer, Integer> prices; // Key is agencyId, value is price
    }
}
