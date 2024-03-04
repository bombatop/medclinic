package courseproject.springbootbackend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.Diagnosis;

@Repository
public interface DiagnosisRepository extends JpaRepository<Diagnosis, Integer> {
    Diagnosis findDiagnosisById(Integer id);

    @Query("SELECT d FROM Diagnosis d")
    List<Diagnosis> findDiagnoses();

    @Query("SELECT d FROM Diagnosis d")
    Page<Diagnosis> findDiagnoses(Pageable pageable);

    @Query("SELECT d FROM Diagnosis d WHERE d.name LIKE :searchQuery")
    Page<Diagnosis> findDiagnoses(@Param("searchQuery") String searchQuery, Pageable pageable);
}