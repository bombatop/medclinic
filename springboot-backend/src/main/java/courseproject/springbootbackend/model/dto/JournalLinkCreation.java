package courseproject.springbootbackend.model.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record JournalLinkCreation (
        @NotNull(message = "Patient id is required")
        Integer patientId,

        @NotNull(message = "Doctor id is required")
        Integer doctorId,

        @NotNull(message = "Date is required")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
        LocalDateTime date,

        @NotNull(message = "Previous journal id for not linked journal is required")
        Integer prevEntryId
) {
}