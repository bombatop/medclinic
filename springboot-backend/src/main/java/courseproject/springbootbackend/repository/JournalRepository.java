package courseproject.springbootbackend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.FileEntity;
import courseproject.springbootbackend.model.entity.JournalEntity;

@Repository
public interface JournalRepository extends JpaRepository<JournalEntity, Integer> {

    List<JournalEntity> findByPatientIdOrderByDateDesc(Integer id);

    @Query("SELECT j FROM JournalEntity j JOIN j.files f WHERE f.id = :id")
    JournalEntity findByFileId(@Param("id") Integer id);

    List<JournalEntity> findByDateBetweenOrderByDateAsc(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT CASE WHEN COUNT(jt) > 0 THEN true ELSE false END FROM JournalEntity j " +
            "JOIN j.treatments jt WHERE j.id = :journalId AND jt.treatment.id = :treatmentId")
    boolean existsJournalTreatmentInJournal(Integer journalId, Integer treatmentId);

    @Query("SELECT CASE WHEN COUNT(jd) > 0 THEN true ELSE false END FROM JournalEntity j " +
            "JOIN j.diagnoses jd WHERE j.id = :journalId AND jd.diagnosis.id = :diagnosisId")
    boolean existsJournalDiagnosisInJournal(Integer journalId, Integer diagnosisId);

    Optional<JournalEntity> findByFilesContains(FileEntity file);
    
    @Query("SELECT j FROM JournalEntity j WHERE j.previousEntry IS NULL AND j.date >= :date " +
           "AND j.patient.id = :patientId ORDER BY j.date ASC")
    List<JournalEntity> findNextEntry(@Param("date") LocalDateTime date, @Param("patientId") Integer patientId);

    @Query("SELECT j FROM JournalEntity j WHERE j.nextEntry IS NULL AND j.date <= :date " +
           "AND j.patient.id = :patientId ORDER BY j.date ASC")
    List<JournalEntity> findPreviousEntry(@Param("date") LocalDateTime date, @Param("patientId") Integer patientId);

    Page<JournalEntity> findByDoctorId(Integer doctorId, Pageable pageable);

    Page<JournalEntity> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    Page<JournalEntity> findByDoctorIdAndDateBetween(Integer doctorId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
}
