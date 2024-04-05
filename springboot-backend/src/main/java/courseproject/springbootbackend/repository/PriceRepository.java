package courseproject.springbootbackend.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.PriceEntity;
import courseproject.springbootbackend.model.entity.TreatmentEntity;

@Repository
public interface PriceRepository extends JpaRepository<PriceEntity, Integer> {
    PriceEntity findPriceById(Integer id);
    
    @Query("SELECT p FROM Price p JOIN p.agency a JOIN p.treatment t WHERE t.id = :id ORDER BY p.date DESC")
    List<PriceEntity> findPricesByTreatmentId(@Param("id") Integer id);
    
    @Query("SELECT p FROM Price p WHERE p.treatment = :treatment AND p.date < :date AND p.date = " +
        "(SELECT MAX(p2.date) FROM Price p2 WHERE p2.treatment = :treatment AND p2.date <= :date)")
    PriceEntity findPriceForTreatmentAndDate(@Param("treatment") TreatmentEntity treatment, @Param("date") Date date);
} 