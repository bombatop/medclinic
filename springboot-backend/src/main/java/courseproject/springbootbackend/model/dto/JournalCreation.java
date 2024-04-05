package courseproject.springbootbackend.model.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record JournalCreation (
        @NotBlank(message = "Email is required")
        String email,

        @Nullable
        String password,

        @NotNull(message="Patient is required")
        Integer patientId,

        @NotNull(message = "Doctor is required")
        Integer doctorId,

        @NotNull(message = "Date is required")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
        Date date
) {
}