package courseproject.springbootbackend.model.dto;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record TreatmentPriceData (
        @NotNull(message = "Price is required")
        @Min(value = 1, message = "Value must be a positive not null number")
        Integer price,

        @NotNull(message="Treatment id is required")
        Integer treatmentId
) {
}