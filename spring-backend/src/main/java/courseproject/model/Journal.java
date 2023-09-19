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
        name = "journal_complaints",
        joinColumns = @JoinColumn(name = "journal_id"),
        inverseJoinColumns = @JoinColumn(name = "complaint_id"))
    private Set<Complaint> complaints;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "journal_anamnesis",
        joinColumns = @JoinColumn(name = "journal_id"),
        inverseJoinColumns = @JoinColumn(name = "anamnesis_id"))
    private Set<Anamnesis> anamnesis;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "journal_objective_status",
        joinColumns = @JoinColumn(name = "journal_id"),
        inverseJoinColumns = @JoinColumn(name = "objective_status_id"))
    private Set<ObjectiveStatus> objectiveStatus;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "journal_diagnoses",
        joinColumns = @JoinColumn(name = "journal_id"),
        inverseJoinColumns = @JoinColumn(name = "diagnosis_id"))
    private Set<Diagnosis> diagnoses;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "journal_treatment_planning",
        joinColumns = @JoinColumn(name = "journal_id"),
        inverseJoinColumns = @JoinColumn(name = "treatment_planning_id"))
    private Set<TreatmentPlanning> treatmentPlanning;
}
