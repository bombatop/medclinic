package courseproject.springbootbackend.model.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record BulkPriceUpdateData (
        @NotNull(message="Date is required")
        @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm")
        LocalDateTime date,

        @NotNull(message = "Agency id is required")
        Integer agencyId,

        @NotEmpty(message = "Prices list cannot be empty")
        List<TreatmentPriceData> prices
) {
}