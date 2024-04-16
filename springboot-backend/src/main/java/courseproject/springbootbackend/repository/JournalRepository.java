package courseproject.springbootbackend.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.FileEntity;
import courseproject.springbootbackend.model.entity.JournalEntity;

@Repository
public interface JournalRepository extends JpaRepository<JournalEntity, Integer> {

    List<JournalEntity> findByPatientId(Integer id);

    @Query("SELECT j FROM JournalEntity j JOIN j.files f WHERE f.id = :id")
    JournalEntity findByFileId(@Param("id") Integer id);

    List<JournalEntity> findByDateBetweenOrderByDateAsc(Date startDate, Date endDate);

    @Query("SELECT CASE WHEN COUNT(jt) > 0 THEN true ELSE false END FROM JournalEntity j " +
            "JOIN j.treatments jt WHERE j.id = :journalId AND jt.treatment.id = :treatmentId")
    boolean existsJournalTreatmentInJournal(Integer journalId, Integer treatmentId);

    Optional<JournalEntity> findByFilesContains(FileEntity file);
}