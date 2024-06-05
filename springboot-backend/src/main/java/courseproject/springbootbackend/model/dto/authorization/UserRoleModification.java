package courseproject.springbootbackend.model.dto.authorization;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record UserRoleModification(
        @NotBlank(message = "Username is required")
        String username,

        @NotNull(message = "Role id is required")
        Integer roleId
) {
}
