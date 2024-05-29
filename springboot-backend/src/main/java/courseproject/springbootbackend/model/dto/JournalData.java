package courseproject.springbootbackend.model.dto;

import java.time.LocalDateTime;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import courseproject.springbootbackend.model.entity.misc.JournalStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record JournalData (
        @NotNull(message = "Patient id is required")
        Integer patientId,

        @NotNull(message = "Doctor id is required")
        Integer doctorId,

        @NotNull(message = "Start date and time is required")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
        LocalDateTime date,

        @NotNull(message = "End time is required")
        @JsonFormat(pattern = "HH:mm")
        LocalTime timeEnd,

        @NotNull(message = "Status is required")
        JournalStatus status
) {
}