package courseproject.springbootbackend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.TreatmentEntity;

@Repository
public interface TreatmentRepository extends JpaRepository<TreatmentEntity, Integer> {

    TreatmentEntity findTreatmentById(Integer id);

    List<TreatmentEntity> findAll();

    Page<TreatmentEntity> findAll(Pageable pageable);

    Page<TreatmentEntity> findByNameContaining(String searchQuery, Pageable pageable);
}