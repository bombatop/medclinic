package courseproject.springbootbackend.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record TreatmentCreation(
        @NotBlank(message = "Name is required")
        String name
) {
}