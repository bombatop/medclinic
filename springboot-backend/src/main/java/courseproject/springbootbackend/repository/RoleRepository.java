package courseproject.springbootbackend.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import courseproject.springbootbackend.model.entity.RoleEntity;

public interface RoleRepository extends JpaRepository<RoleEntity, Integer> {

    Page<RoleEntity> findByNameContaining(String searchQuery, Pageable pageable);

    Optional<RoleEntity> findByName(String name);
}
