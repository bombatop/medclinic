package courseproject.springbootbackend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.TreatmentEntity;

@Repository
public interface TreatmentRepository extends JpaRepository<TreatmentEntity, Integer>, JpaSpecificationExecutor<TreatmentEntity> {

    Page<TreatmentEntity> findByNameContaining(String searchQuery, Pageable pageable);
}
