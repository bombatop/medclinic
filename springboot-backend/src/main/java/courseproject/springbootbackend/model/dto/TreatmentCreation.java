package courseproject.springbootbackend.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record TreatmentCreation(
        @NotBlank(message = "Сode is required")
        String code,

        @NotBlank(message = "Name is required")
        String name
) {
}