package courseproject.model;

import java.io.Serializable;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Column;
import org.springframework.data.redis.core.RedisHash;

@RedisHash("diagnosis")
@Data
@NoArgsConstructor
public class Diagnosis implements Serializable {

    @Id
    private String id;

    // Keep the existing column definition as is
    @Column(name = "name")
    private String name;
}