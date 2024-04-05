package courseproject.springbootbackend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.Agency;

@Repository
public interface AgencyRepository extends JpaRepository<Agency, Integer> {
    Agency findAgencyById(Integer id);

    @Query("SELECT d FROM Agency d")
    List<Agency> findAgencies();

    @Query("SELECT d FROM Agency d")
    Page<Agency> findAgencies(Pageable pageable);

    @Query("SELECT d FROM Agency d WHERE d.name LIKE :searchQuery")
    Page<Agency> findAgencies(@Param("searchQuery") String searchQuery, Pageable pageable);
}