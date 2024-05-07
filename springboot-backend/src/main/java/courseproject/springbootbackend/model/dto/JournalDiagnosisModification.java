package courseproject.springbootbackend.model.dto;

import java.util.List;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record JournalDiagnosisModification(
        @NotNull(message = "Toothcode of diagnosis must be specified")
        List<String> toothcodes
) {
}