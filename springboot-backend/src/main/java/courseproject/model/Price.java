package courseproject.model;

import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@RedisHash("price")
@Data
@NoArgsConstructor
public class Price implements Serializable {

    @Id
    private String id;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be a positive number")
    private int price;

    @NotNull(message = "Date is required")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime date;

    @NotNull(message = "Treatment is required")
    private String treatmentId;

    @NotNull(message = "Agency is required")
    private String agencyId;
}