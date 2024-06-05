package courseproject.springbootbackend.model.dto.authorization;

import lombok.Builder;

@Builder
public record TokenGenerationData(
        long userId,

        String username,

        long roleId
) {
}
