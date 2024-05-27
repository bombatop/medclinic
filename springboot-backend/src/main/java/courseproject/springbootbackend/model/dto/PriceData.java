package courseproject.springbootbackend.model.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record PriceData (
        @NotNull(message="Date is required")
        @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm")
        LocalDateTime date,

        @NotNull(message = "Price is required")
        @Min(value = 1, message = "Value must be a positive not null number")
        Integer price,
        
        @NotNull(message="Treatment id is required")
        Integer treatmentId,

        @NotNull(message = "Agency id is required")
        Integer agencyId
) {
}