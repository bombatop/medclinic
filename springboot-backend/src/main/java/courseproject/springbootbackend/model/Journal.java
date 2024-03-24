package courseproject.springbootbackend.model;

import java.util.Date;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "journal")
@Getter
@Setter
@NoArgsConstructor
public class Journal {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @NotNull(message = "Patient is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @NotNull(message = "Doctor is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @NotNull(message = "Date is required")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private Date date;

    @ManyToMany(targetEntity = Price.class, fetch = FetchType.EAGER)
    @JoinTable(
        name = "journal_pricelist",
        joinColumns = @JoinColumn(name = "journal_id"),
        inverseJoinColumns = @JoinColumn(name = "treatment_price_id"))
    private Set <Price> prices;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "journal_files", 
        joinColumns = @JoinColumn(name = "journal_id"),
        inverseJoinColumns = @JoinColumn(name = "file_id"))
    private Set<Filepath> files;

    // @ManyToMany(fetch = FetchType.EAGER)
    // @JoinTable(
    //     name = "journal_diagnoses",
    //     joinColumns = @JoinColumn(name = "journal_id"),
    //     inverseJoinColumns = @JoinColumn(name = "diagnosis_id"))
    // private Set<Diagnosis> diagnoses;
}
