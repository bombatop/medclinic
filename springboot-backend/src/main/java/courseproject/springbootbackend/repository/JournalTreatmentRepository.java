package courseproject.springbootbackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import courseproject.springbootbackend.model.entity.JournalTreatmentEntity;

public interface JournalTreatmentRepository extends JpaRepository<JournalTreatmentEntity, Integer> {
    List<JournalTreatmentEntity> findByJournalId(Integer journalId);
}
