package courseproject.springbootbackend.model.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record JournalCreation (

        @NotNull(message = "Patient id is required")
        Integer patientId,

        @NotNull(message = "Doctor id is required")
        Integer doctorId,

        @NotNull(message = "Date is required")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
        Date date
) {
}