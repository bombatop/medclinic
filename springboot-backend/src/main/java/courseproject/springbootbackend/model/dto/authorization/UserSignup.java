package courseproject.springbootbackend.model.dto.authorization;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;

@Builder
public record UserSignup(
        @NotBlank(message = "Name is required")
        @Pattern(regexp = "^[А-Яа-яЁё\\s]+$", message = "Name should contain only letters")
        String name,

        @NotBlank(message = "Surname is required")
        @Pattern(regexp = "^[А-Яа-яЁё\\s]+$", message = "Surname should contain only letters")
        String surname,
        
        @NotBlank(message = "Surname is required")
        @Pattern(regexp = "^[А-Яа-яЁё\\s]+$", message = "Patronymic should contain only letters")
        String patronymic,

        @NotBlank(message = "Username is required")
        String username,

        @NotBlank(message = "Password is required")
        String password,

        // @NotBlank(message="Phone number is required")
        String phonenumber,

        // @NotBlank(message = "Email is required")
        String email
) {
}

