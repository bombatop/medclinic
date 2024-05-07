package courseproject.springbootbackend.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record DiagnosisCreation(

        @NotBlank(message = "ICD Code is required")
        String icdCode,
        
        @NotBlank(message = "Name is required")
        String name
) {
}