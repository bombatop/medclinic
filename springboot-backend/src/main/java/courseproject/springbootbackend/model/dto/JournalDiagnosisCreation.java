package courseproject.springbootbackend.model.dto;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record JournalDiagnosisCreation(
        
        @NotNull(message = "Diagnosis id is required")
        Integer diagnosisId,

        @NotEmpty(message = "Toothcode of diagnosis must be specified")
        List<String> toothcodes
) {
}