package courseproject.springbootbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import courseproject.springbootbackend.model.entity.JournalTreatmentEntity;

public interface JournalTreatmentRepository extends JpaRepository<JournalTreatmentEntity, Integer> {
    
    // boolean existsByJournalIdAndTreatment(Integer journalId, TreatmentEntity treatment);
}
