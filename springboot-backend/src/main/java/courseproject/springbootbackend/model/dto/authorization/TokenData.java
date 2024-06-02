package courseproject.springbootbackend.model.dto.authorization;

import lombok.Builder;

@Builder
public record TokenData(
        long userId,

        String email,

        long roleId
) {
}
