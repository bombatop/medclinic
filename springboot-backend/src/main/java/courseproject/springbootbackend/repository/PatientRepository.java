package courseproject.springbootbackend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.PatientEntity;

@Repository
public interface PatientRepository extends JpaRepository<PatientEntity, Integer> {
    
    @Query("SELECT p FROM PatientEntity p WHERE p.surname LIKE %:searchQuery% OR " +
           "p.name LIKE %:searchQuery% OR p.patronymic LIKE %:searchQuery%")
    Page<PatientEntity> searchPatients(@Param("searchQuery") String searchQuery, Pageable pageable);

    Page <PatientEntity> findByNameContaining(String searchQuery, Pageable page);
}