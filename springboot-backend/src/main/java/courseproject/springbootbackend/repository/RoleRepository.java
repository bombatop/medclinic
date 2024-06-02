package courseproject.springbootbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import courseproject.springbootbackend.model.entity.RoleEntity;

public interface RoleRepository extends JpaRepository<RoleEntity, Integer> {

    RoleEntity findByName(String name);
}
