package courseproject.springbootbackend.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer>, JpaSpecificationExecutor<UserEntity> {

    Optional<UserEntity> findByUsername(String username);

    @Query("SELECT d FROM UserEntity d WHERE d.surname LIKE %:searchQuery% OR " +
           "d.name LIKE %:searchQuery% OR d.patronymic LIKE %:searchQuery%")
    Page<UserEntity> searchUsers(@Param("searchQuery") String searchQuery, Pageable pageable);
}