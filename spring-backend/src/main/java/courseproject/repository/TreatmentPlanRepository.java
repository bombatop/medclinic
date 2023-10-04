package courseproject.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.model.TreatmentPlan;

@Repository
public interface TreatmentPlanRepository extends JpaRepository<TreatmentPlan, Integer> {
    TreatmentPlan findTreatmentPlanById(Integer id);

    @Query("SELECT d FROM TreatmentPlan d")
    List<TreatmentPlan> findTreatmentPlans();

    @Query("SELECT d FROM TreatmentPlan d")
    Page<TreatmentPlan> findTreatmentPlans(Pageable pageable);

    @Query("SELECT d FROM TreatmentPlan d WHERE d.name LIKE :searchQuery")
    Page<TreatmentPlan> findTreatmentPlans(@Param("searchQuery") String searchQuery, Pageable pageable);
}