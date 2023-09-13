package courseproject.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "treatment_price")
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
}