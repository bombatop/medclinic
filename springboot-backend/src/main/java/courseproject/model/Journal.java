package courseproject.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.format.annotation.DateTimeFormat;

@RedisHash("journal")
@Data
@NoArgsConstructor
public class Journal implements Serializable {

    @Id
    private String id;

    @NotNull(message = "Patient is required")
    private String patientId;

    @NotNull(message = "Doctor is required")
    private String doctorId;

    @NotNull(message = "Date is required")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime date;

    private Set<String> priceIds = new HashSet<>();

    private Set<String> fileIds = new HashSet<>();

    // private Set<String> diagnosisIds = new HashSet<>();
}