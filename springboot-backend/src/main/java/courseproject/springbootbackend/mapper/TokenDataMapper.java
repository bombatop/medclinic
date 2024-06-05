package courseproject.springbootbackend.mapper;

import org.springframework.stereotype.Component;

import courseproject.springbootbackend.model.dto.authorization.TokenGenerationData;
import courseproject.springbootbackend.model.entity.UserEntity;

@Component
public class TokenDataMapper {

    public TokenGenerationData map(final UserEntity userEntity) {
        return TokenGenerationData.builder()
                .username(userEntity.getUsername())
                .userId(userEntity.getId())
                .roleId(userEntity.getRole().getId())
                .build();
    }

}