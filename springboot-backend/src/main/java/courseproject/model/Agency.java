package courseproject.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.ColumnDefault;
import org.springframework.data.annotation.NotBlank;
import org.springframework.data.redis.core.RedisHash;

@RedisHash("agency")
@Data
@NoArgsConstructor
public class Agency {

    @Id
    private String id;

    @NotBlank(message = "Appropriate name is required")
    private String name;

    @ColumnDefault("false")
    private boolean loadedByDefault;
}