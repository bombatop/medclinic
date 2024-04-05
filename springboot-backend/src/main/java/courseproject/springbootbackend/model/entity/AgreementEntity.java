package courseproject.springbootbackend.model.entity;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToOne;
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
@Table(name = "agreement")
@Builder
public class AgreementEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @ManyToOne(targetEntity = PatientEntity.class, fetch = FetchType.EAGER)
    @JoinTable(name = "patient_agency_agreement",
        joinColumns = @JoinColumn(name = "agency_id"),
        inverseJoinColumns = @JoinColumn(name = "patient_id"))
    private PatientEntity patient;

    @NotNull(message = "Date is required")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private Date date;
}