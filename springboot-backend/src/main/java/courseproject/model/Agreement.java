package courseproject.model;

import java.time.LocalDateTime;
import java.io.Serializable;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.ManyToOne;
import org.springframework.data.annotation.NotNull;
import org.springframework.data.annotation.DateTimeFormat;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.format.annotation.DateTimeFormat;

@RedisHash("agreement")
@Data
@NoArgsConstructor
public class Agreement implements Serializable {

    @Id
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    private Patient patient;

    @NotNull(message = "Date is required")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime date;
}