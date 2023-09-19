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
@Table(name = "diagnosis")
@Getter
@Setter
@NoArgsConstructor
public class Diagnosis {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    // @NotBlank(message = "Appropriate name is required")
    @Column(name = "name")
    // @Pattern(regexp = "^[a-zA-Z]+$", message = "First name should contain only letters")
    private String name;
}