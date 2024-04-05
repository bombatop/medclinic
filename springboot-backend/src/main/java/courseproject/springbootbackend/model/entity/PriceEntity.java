package courseproject.springbootbackend.model.entity;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "price")
@Builder
public class PriceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be a positive number")
    private Integer price;

    @NotNull(message = "Date is required")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private Date date;

    @NotNull(message = "Treatment is required")
    @ManyToOne(targetEntity = TreatmentEntity.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "treatment_id", referencedColumnName = "id")
    private TreatmentEntity treatment;

    @NotNull(message = "Agency is required")
    @ManyToOne(targetEntity = AgencyEntity.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "agency_id", referencedColumnName = "id")
    private AgencyEntity agency;
}