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
    List<Anamnesis> findAnamneses();

    @Query("SELECT d FROM Anamnesis d")
    Page<Anamnesis> findAnamneses(Pageable pageable);

    @Query("SELECT d FROM Anamnesis d WHERE d.name LIKE :searchQuery")
    Page<Anamnesis> findAnamneses(@Param("searchQuery") String searchQuery, Pageable pageable);
}