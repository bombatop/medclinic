package courseproject.springbootbackend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.AgencyEntity;

@Repository
public interface AgencyRepository extends JpaRepository<AgencyEntity, Integer> {
    AgencyEntity findAgencyById(Integer id);

    @Query("SELECT d FROM Agency d")
    List<AgencyEntity> findAgencies();

    @Query("SELECT d FROM Agency d")
    Page<AgencyEntity> findAgencies(Pageable pageable);

    @Query("SELECT d FROM Agency d WHERE d.name LIKE :searchQuery")
    Page<AgencyEntity> findAgencies(@Param("searchQuery") String searchQuery, Pageable pageable);
}