package courseproject.model;

import java.io.Serializable;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@RedisHash("patient")
@Data
@NoArgsConstructor
public class Patient implements Serializable {

    @Id
    private String id;

    @NotBlank(message = "Name is required")
    @Pattern(regexp = "^[a-zA-Z]+$", message = "Name should contain only letters")
    private String name;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;
}