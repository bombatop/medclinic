package courseproject.springbootbackend.model.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record PriceCreation (
        @NotNull(message="Date is required")
        @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm")
        Date date,

        @NotNull(message = "Price is required")
        @Min(value = 1, message = "Value must be a positive not null number")
        Integer price,
        
        @NotNull(message="Treatment is required")
        Integer treatmentId,

        @NotNull(message = "Agency is required")
        Integer agencyId
) {
}