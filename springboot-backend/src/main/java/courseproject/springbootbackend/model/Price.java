package courseproject.springbootbackend.model;

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

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "treatment_agency_price")
@Getter
@Setter
@NoArgsConstructor
public class Price {
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
    @ManyToOne(targetEntity = Treatment.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "treatment_id", referencedColumnName = "id")
    private Treatment treatment;

    @NotNull(message = "Agency is required")
    @ManyToOne(targetEntity = Agency.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "agency_id", referencedColumnName = "id")
    private Agency agency;
}