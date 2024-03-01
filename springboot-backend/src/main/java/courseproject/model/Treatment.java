package courseproject.model;

import java.io.Serializable;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@RedisHash("treatment")
@Data
@NoArgsConstructor
public class Treatment implements Serializable {

    @Id
    private String id;

    @NotBlank(message = "Name is required")
    private String name;
}