package courseproject.springbootbackend.mapper;

import org.springframework.stereotype.Component;

import courseproject.springbootbackend.model.dto.UserData;
import courseproject.springbootbackend.model.entity.UserEntity;

@Component
public class UserMapper {

    public UserEntity map(final UserData dto) {
        return UserEntity.builder()
                .name(dto.name())
                .email(dto.email())
                .password(dto.password())
                .surname(dto.surname())
                .patronymic(dto.patronymic())
                .phonenumber(dto.phonenumber())
                .build();
    }
}
