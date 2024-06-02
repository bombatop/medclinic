package courseproject.springbootbackend.model.dto;

import lombok.Builder;

@Builder
public record JwtAuthenticationResponse(String token) {
}