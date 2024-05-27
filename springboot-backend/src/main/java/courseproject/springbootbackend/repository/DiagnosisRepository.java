package courseproject.springbootbackend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.DiagnosisEntity;

@Repository
public interface DiagnosisRepository extends JpaRepository<DiagnosisEntity, Integer>, JpaSpecificationExecutor<DiagnosisEntity> {

    Page<DiagnosisEntity> findByNameContaining(String searchQuery, Pageable pageable);
}