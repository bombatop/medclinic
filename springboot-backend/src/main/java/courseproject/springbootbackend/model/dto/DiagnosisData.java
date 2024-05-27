package courseproject.springbootbackend.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record DiagnosisData(
        @NotBlank(message = "ICD Code is required")
        String code,
        
        @NotBlank(message = "Name is required")
        String name
) {
}