package courseproject.springbootbackend.model.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;

@Builder
public record TreatmentCreation(
        @NotBlank(message = "Name is required")
        @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Name should contain only letters")
        String name,

        @NotBlank(message = "Phone number is required") @Column(name = "phone_number")
        String phonenumber
) {
}