package courseproject.springbootbackend.model.dto;

import java.time.LocalDateTime;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record JournalLinkData (
        @NotNull(message = "Patient id is required")
        Integer patientId,

        @NotNull(message = "Doctor id is required")
        Integer doctorId,

        @NotNull(message = "Start date and time is required")
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime date,

        @NotNull(message = "End time is required")
        @JsonFormat(pattern = "HH:mm")
        LocalTime timeEnd,

        @NotNull(message = "Previous journal id for not linked journal is required")
        Integer prevEntryId
) {
}