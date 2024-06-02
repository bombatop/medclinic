package courseproject.springbootbackend.model.dto.authorization;

import lombok.Builder;

@Builder
public record JwtAuthenticationResponse(String token) {
}