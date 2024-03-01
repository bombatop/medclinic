package courseproject.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.model.Treatment;

@Repository
public interface TreatmentRepository extends JpaRepository<Treatment, Integer> {
    Treatment findTreatmentById(Integer id);

    @Query("SELECT t FROM Treatment t")
    List<Treatment> findTreatments();

    @Query("SELECT t FROM Treatment t")
    Page<Treatment> findTreatments(Pageable pageable);

    @Query("SELECT t FROM Treatment t WHERE t.name LIKE :searchQuery")
    Page<Treatment> findTreatments(@Param("searchQuery") String searchQuery, Pageable pageable);
}