package courseproject.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.model.Anamnesis;

@Repository
public interface AnamnesisRepository extends JpaRepository<Anamnesis, Integer> {
    Anamnesis findAnamnesisById(Integer id);

    @Query("SELECT d FROM Anamnesis d")
    List<Anamnesis> findAnamnesis();

    @Query("SELECT d FROM Anamnesis d")
    Page<Anamnesis> findAnamnesis(Pageable pageable);

    @Query("SELECT d FROM Anamnesis d WHERE d.firstName LIKE :searchQuery OR d.lastName LIKE :searchQuery")
    Page<Anamnesis> findAnamnesis(@Param("searchQuery") String searchQuery, Pageable pageable);
}