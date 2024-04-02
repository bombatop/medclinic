package courseproject.springbootbackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.JournalTreatment;

public interface JournalTreatmentRepository extends JpaRepository<JournalTreatment, Integer> {
    List<JournalTreatment> findByJournalId(Integer journalId);
}
