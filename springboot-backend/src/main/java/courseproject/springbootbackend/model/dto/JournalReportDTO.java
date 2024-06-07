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
    private Map<Integer, TreatmentReportData> treatments; // Use treatment ID as key

    @Data
    public static class TreatmentReportData {
        private TreatmentEntity treatment; // Include treatment details
        private int amount;
        private Map<Integer, AgencyPriceData> prices; // Use agency ID as key

        @Data
        public static class AgencyPriceData {
            private AgencyEntity agency; // Include agency details
            private int price;
        }
    }
}
