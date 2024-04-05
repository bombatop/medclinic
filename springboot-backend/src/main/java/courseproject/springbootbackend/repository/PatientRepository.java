package courseproject.springbootbackend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.PatientEntity;

@Repository
public interface PatientRepository extends JpaRepository<PatientEntity, Integer> {
    
    PatientEntity findPatientById(Integer id);
    
    List<PatientEntity> findAll();

    Page<PatientEntity> findAll(Pageable pageable);

    Page <PatientEntity> findByNameContaining(String searchQuery, Pageable page);
}