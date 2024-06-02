package courseproject.springbootbackend.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import courseproject.springbootbackend.model.entity.RoleEntity;

public interface RoleRepository extends JpaRepository<RoleEntity, Integer> {

    Optional<RoleEntity> findByName(String name);
}
