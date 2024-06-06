package courseproject.springbootbackend.model.dto;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record JournalReportRequestDTO (
        @NotNull(message = "Agency IDs are required")
        List<Integer> agencyIds
) {
}
