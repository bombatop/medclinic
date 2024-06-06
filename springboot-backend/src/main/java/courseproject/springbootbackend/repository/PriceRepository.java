package courseproject.springbootbackend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.PriceEntity;

@Repository
public interface PriceRepository extends JpaRepository<PriceEntity, Integer>, 
        JpaSpecificationExecutor<PriceEntity> {

    @Query("SELECT p FROM PriceEntity p WHERE "
            + "p.treatment.id = :treatmentId AND p.agency.id = :agencyId AND p.date <= :date "
            + " ORDER BY p.date DESC")
    List<PriceEntity> findPricesByTreatmentAndDateAndAgency(
            @Param("treatmentId") Integer treatmentId,
            @Param("agencyId") Integer agencyId,
            @Param("date") LocalDateTime date);

    default PriceEntity findLatestPriceByTreatmentAndDateAndAgency(Integer treatmentId, Integer agencyId, LocalDateTime date) {
        List<PriceEntity> prices = findPricesByTreatmentAndDateAndAgency(treatmentId, agencyId, date);
        return prices.isEmpty() ? null : prices.get(0);
    }
}