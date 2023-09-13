package courseproject.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.model.Price;
import courseproject.model.Treatment;

@Repository
public interface PriceRepository extends JpaRepository<Price, Integer> {
    Price findPriceById(Integer id);
    
    @Query("SELECT p FROM Price p JOIN p.treatment t WHERE t.id = :id ORDER BY p.date DESC")
    List<Price> findPricesByTreatmentId(@Param("id") Integer id);
    
    @Query("SELECT p FROM Price p WHERE p.treatment = :treatment AND p.date < :date AND p.date = " +
        "(SELECT MAX(p2.date) FROM Price p2 WHERE p2.treatment = :treatment AND p2.date <= :date)")
    Price findPriceForTreatmentAndDate(@Param("treatment") Treatment treatment, @Param("date") Date date);
} 