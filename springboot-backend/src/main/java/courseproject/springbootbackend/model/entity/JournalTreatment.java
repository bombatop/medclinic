package courseproject.springbootbackend.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
// @NoArgsConstructor(access = AccessLevel.PROTECTED)
// @AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor()
@AllArgsConstructor()
@Entity
@Table(name = "journal_treatment")
@Builder
public class JournalTreatment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "journal_id")
    private Journal journal;

    @ManyToOne
    @JoinColumn(name = "treatment_id")
    private Treatment treatment;

    private Integer amount;
}