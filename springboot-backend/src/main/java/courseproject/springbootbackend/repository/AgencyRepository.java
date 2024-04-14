package courseproject.springbootbackend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.AgencyEntity;

@Repository
public interface AgencyRepository extends JpaRepository<AgencyEntity, Integer> {

    List<AgencyEntity> findAll();

    Page<AgencyEntity> findAll(Pageable pageable);
    
    Page<AgencyEntity> findByNameContaining(String searchQuery, Pageable pageable);
}