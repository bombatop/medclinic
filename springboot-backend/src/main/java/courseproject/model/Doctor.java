package courseproject.model;

import java.io.Serializable;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.NotBlank;
import org.springframework.data.annotation.Pattern;
import org.springframework.data.redis.core.RedisHash;

@RedisHash("doctor")
@Data
@NoArgsConstructor
public class Doctor implements Serializable {

    @Id
    private String id;

    @NotBlank(message = "Name is required")
    @Pattern(regexp = "^[a-zA-Z]+$", message = "Name should contain only letters")
    private String name;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;
}