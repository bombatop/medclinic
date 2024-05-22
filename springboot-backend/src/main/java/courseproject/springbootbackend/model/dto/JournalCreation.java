package courseproject.springbootbackend.model.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import courseproject.springbootbackend.model.entity.misc.JournalStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record JournalCreation (
        @NotNull(message = "Patient id is required")
        Integer patientId,

        @NotNull(message = "Doctor id is required")
        Integer doctorId,

        @NotNull(message = "Start date is required")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
        LocalDateTime dateStart,

        @NotNull(message = "End date is required")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
        LocalDateTime dateEnd,

        @NotNull(message = "Status is required")
        JournalStatus status
) {
}