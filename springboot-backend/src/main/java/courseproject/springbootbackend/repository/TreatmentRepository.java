package courseproject.springbootbackend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.TreatmentEntity;

@Repository
public interface TreatmentRepository extends JpaRepository<TreatmentEntity, Integer> {
    TreatmentEntity findTreatmentById(Integer id);

    @Query("SELECT t FROM Treatment t")
    List<TreatmentEntity> findTreatments();

    @Query("SELECT t FROM Treatment t")
    Page<TreatmentEntity> findTreatments(Pageable pageable);

    @Query("SELECT t FROM Treatment t WHERE t.name LIKE :searchQuery")
    Page<TreatmentEntity> findTreatments(@Param("searchQuery") String searchQuery, Pageable pageable);
}