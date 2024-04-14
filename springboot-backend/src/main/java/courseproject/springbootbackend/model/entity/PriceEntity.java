package courseproject.springbootbackend.model.entity;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

    private Integer price;

    private Date date;

    @ManyToOne(targetEntity = TreatmentEntity.class)
    @JoinColumn(name = "treatment_id", referencedColumnName = "id")
    private TreatmentEntity treatment;

    @ManyToOne(targetEntity = AgencyEntity.class)
    @JoinColumn(name = "agency_id", referencedColumnName = "id")
    private AgencyEntity agency;
}