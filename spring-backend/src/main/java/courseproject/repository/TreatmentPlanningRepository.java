package courseproject.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.model.TreatmentPlanning;

@Repository
public interface TreatmentPlanningRepository extends JpaRepository<TreatmentPlanning, Integer> {
    TreatmentPlanning TreatmentPlanningById(Integer id);

    @Query("SELECT d FROM TreatmentPlanning d")
    List<TreatmentPlanning> TreatmentPlannings();

    @Query("SELECT d FROM TreatmentPlanning d")
    Page<TreatmentPlanning> TreatmentPlannings(Pageable pageable);

    @Query("SELECT d FROM TreatmentPlanning d WHERE d.firstName LIKE :searchQuery OR d.lastName LIKE :searchQuery")
    Page<TreatmentPlanning> TreatmentPlannings(@Param("searchQuery") String searchQuery, Pageable pageable);
}