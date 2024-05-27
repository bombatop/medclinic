package courseproject.springbootbackend.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record AgencyData(
        @NotBlank(message = "Name is required")
        String name,

        @NotNull
        Boolean loadedByDefault
) {
}