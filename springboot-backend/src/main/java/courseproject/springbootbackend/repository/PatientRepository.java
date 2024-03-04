package courseproject.springbootbackend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Integer> {
    Patient findPatientById(Integer id);
    
    @Query("SELECT p FROM Patient p")
    List<Patient> findPatients();

    @Query("SELECT p FROM Patient p")
    Page<Patient> findPatients(Pageable pageable);

    @Query("SELECT p FROM Patient p WHERE p.name LIKE :searchQuery")
    Page<Patient> findPatients(@Param("searchQuery") String searchQuery, Pageable pageable);
}