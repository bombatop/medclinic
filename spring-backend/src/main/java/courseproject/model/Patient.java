package courseproject.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Pattern;

import org.hibernate.validator.constraints.NotBlank;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "patient")
@Getter
@Setter
@NoArgsConstructor
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @NotBlank(message = "First name is required")
    @Column(name = "first_name")
    @Pattern(regexp = "^[a-zA-Z]+$", message = "First name should contain only letters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Column(name = "last_name")
    @Pattern(regexp = "^[a-zA-Z]+$", message = "Last name should contain only letters")
    private String lastName;

    @NotBlank(message = "Phone number is required")
    @Column(name = "phone_number")
    private String phoneNumber;
}
