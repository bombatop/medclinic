package courseproject.springbootbackend.model.entity;

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
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
@Table(name = "journal")
@Builder
public class JournalEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id")
    private PatientEntity patient;

    @ManyToOne(fetch = FetchType.EAGER) 
    @JoinColumn(name = "doctor_id")
    private DoctorEntity doctor;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private Date date;

    @OneToMany(targetEntity = TreatmentEntity.class, fetch = FetchType.EAGER)
    @JoinTable(
        name = "journal_treatment",
        joinColumns = @JoinColumn(name = "journal_id"),
        inverseJoinColumns = @JoinColumn(name = "treatment_id"))
    private Set <JournalTreatmentEntity> treatments;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "journal_files", 
        joinColumns = @JoinColumn(name = "journal_id"),
        inverseJoinColumns = @JoinColumn(name = "file_id"))
    private Set<FilepathEntity> files;
}
