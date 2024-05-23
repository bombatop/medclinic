package courseproject.springbootbackend.model.entity;

import java.time.LocalDateTime;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import courseproject.springbootbackend.model.entity.misc.JournalStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
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

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    @Column(name = "date_start")
    private LocalDateTime dateStart;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    @Column(name = "date_end")
    private LocalDateTime dateEnd;

    @JsonIncludeProperties({ "id", "name", "surname", "patronymic" })
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private PatientEntity patient;

    @JsonIncludeProperties({ "id", "name", "surname", "patronymic" })
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private DoctorEntity doctor;

    @Enumerated(EnumType.STRING)
    private JournalStatus status;

    @OneToMany
    private Set<JournalTreatmentEntity> treatments;

    @OneToMany
    private Set<JournalDiagnosisEntity> diagnoses;

    @OneToMany
    private Set<FileEntity> files;

    @JsonIncludeProperties({ "id", "dateStart", "dateEnd" })
    @OneToOne
    @JoinColumn(name = "previous_entry_id")
    private JournalEntity previousEntry;

    @JsonIncludeProperties({ "id", "dateStart", "dateEnd" })
    @OneToOne(mappedBy = "previousEntry")
    private JournalEntity nextEntry;
}
