package courseproject.springbootbackend.model.dto;

import java.util.List;
import java.util.Map;

import courseproject.springbootbackend.model.entity.AgencyEntity;
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
    private Map<TreatmentEntity, TreatmentReportData> treatments;

    @Data
    public static class TreatmentReportData {
        private int amount;
        private Map<AgencyEntity, Integer> prices; // Key is agency, value is price
    }
}
