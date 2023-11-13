package courseproject.model;

import java.util.Date;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

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
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
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
