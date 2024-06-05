package courseproject.springbootbackend.model.dto.authorization;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record UserAuthModification(
        @NotBlank(message = "Username is required")
        String username,

        @NotBlank(message = "Password is required")
        String password
) {
}
