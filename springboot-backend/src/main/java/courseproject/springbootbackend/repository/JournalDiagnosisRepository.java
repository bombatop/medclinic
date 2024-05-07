package courseproject.springbootbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import courseproject.springbootbackend.model.entity.JournalDiagnosisEntity;

public interface JournalDiagnosisRepository extends JpaRepository<JournalDiagnosisEntity, Integer> {

}
