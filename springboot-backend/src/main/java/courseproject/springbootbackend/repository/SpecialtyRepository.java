package courseproject.springbootbackend.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import courseproject.springbootbackend.model.entity.SpecialtyEntity;

public interface SpecialtyRepository extends JpaRepository<SpecialtyEntity, Integer> {

    Page<SpecialtyEntity> findByNameContaining(String searchQuery, Pageable pageable);

    Optional<SpecialtyEntity> findByName(String name);
}
