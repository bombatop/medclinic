package courseproject.springbootbackend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.DiagnosisEntity;

@Repository
public interface DiagnosisRepository extends JpaRepository<DiagnosisEntity, Integer> {

    List<DiagnosisEntity> findAll();

    Page<DiagnosisEntity> findAll(Pageable pageable);

    Page<DiagnosisEntity> findByNameContaining(String searchQuery, Pageable pageable);
}