package courseproject.springbootbackend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.PatientEntity;

@Repository
public interface PatientRepository extends JpaRepository<PatientEntity, Integer> {
    PatientEntity findPatientById(Integer id);
    
    @Query("SELECT p FROM Patient p")
    List<PatientEntity> findPatients();

    @Query("SELECT p FROM Patient p")
    Page<PatientEntity> findPatients(Pageable pageable);

    @Query("SELECT p FROM Patient p WHERE p.name LIKE :searchQuery")
    Page<PatientEntity> findPatients(@Param("searchQuery") String searchQuery, Pageable pageable);
}