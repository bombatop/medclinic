package courseproject.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.model.ObjectiveStatus;

@Repository
public interface ObjectiveStatusRepository extends JpaRepository<ObjectiveStatus, Integer> {
    ObjectiveStatus findObjectiveStatusById(Integer id);

    @Query("SELECT d FROM ObjectiveStatus d")
    List<ObjectiveStatus> findObjectiveStatuses();

    @Query("SELECT d FROM ObjectiveStatus d")
    Page<ObjectiveStatus> findObjectiveStatuses(Pageable pageable);

    @Query("SELECT d FROM ObjectiveStatus d WHERE d.firstName LIKE :searchQuery OR d.lastName LIKE :searchQuery")
    Page<ObjectiveStatus> findObjectiveStatuses(@Param("searchQuery") String searchQuery, Pageable pageable);
}