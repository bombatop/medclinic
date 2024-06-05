package courseproject.springbootbackend.mapper;

import org.springframework.stereotype.Component;

import courseproject.springbootbackend.model.dto.authorization.UserSignin;
import courseproject.springbootbackend.model.dto.authorization.UserSignup;
import courseproject.springbootbackend.model.dto.authorization.UserBasicModification;
import courseproject.springbootbackend.model.entity.UserEntity;

@Component
public class UserMapper {

    public UserEntity map(final UserSignup dto) {
        return UserEntity.builder()
                .name(dto.name())
                .surname(dto.surname())
                .patronymic(dto.patronymic())
                .phonenumber(dto.phonenumber())
                .email(dto.email())
                .build();
    }

    public UserEntity map(UserEntity entity, final UserSignin dto) {
        entity.setUsername(dto.username());
        entity.setPassword(dto.password());
        return entity;
    }

    public UserEntity map(UserEntity entity, final UserBasicModification dto) {
        entity.setName(dto.name());
        entity.setSurname(dto.surname());
        entity.setPatronymic(dto.patronymic());
        entity.setPhonenumber(dto.phonenumber());
        entity.setEmail(dto.email());
        return entity;
    }
}
