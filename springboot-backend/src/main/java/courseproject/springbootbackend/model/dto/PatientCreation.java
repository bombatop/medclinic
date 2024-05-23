package courseproject.springbootbackend.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;

@Builder
public record PatientCreation(
        @NotBlank(message = "Name is required")
        @Pattern(regexp = "^[А-Яа-яЁё\\s]+$", message = "Name should contain only letters")
        String name,

        @NotBlank(message = "Surname is required")
        @Pattern(regexp = "^[А-Яа-яЁё\\s]+$", message = "Surname should contain only letters")
        String surname,

        @NotBlank(message = "Patronymic is required")
        @Pattern(regexp = "^[А-Яа-яЁё\\s]+$", message = "Patronymic should contain only letters")
        String patronymic,

        @NotBlank(message = "Phone number is required")
        String phoneNumber
) {
}
