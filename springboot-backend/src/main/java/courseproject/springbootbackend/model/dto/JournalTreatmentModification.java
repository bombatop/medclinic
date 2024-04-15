package courseproject.springbootbackend.model.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record JournalTreatmentModification(
        @NotNull(message = "Amount of treatments must be specified")
        @Min(value = 1, message = "Value must be a positive not null number")
        Integer amount
) {
}