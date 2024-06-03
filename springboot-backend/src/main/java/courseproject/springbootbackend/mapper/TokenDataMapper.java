package courseproject.springbootbackend.mapper;

import org.springframework.stereotype.Component;

import courseproject.springbootbackend.model.dto.authorization.TokenData;
import courseproject.springbootbackend.model.entity.UserEntity;

@Component
public class TokenDataMapper {

    public TokenData map(final UserEntity userEntity) {
        return TokenData.builder()
                .username(userEntity.getUsername())
                .userId(userEntity.getId())
                .roleId(userEntity.getRole().getId())
                .build();
    }

}