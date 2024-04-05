package courseproject.springbootbackend.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.JournalEntity;

@Repository
public interface JournalRepository extends JpaRepository<JournalEntity, Integer> {
    
    JournalEntity findByFilesId(Integer id);

    List<JournalEntity> findByPatientId(Integer id);

    List<JournalEntity> findByDateBetweenOrderByDateAsc(Date startDate, Date endDate);
}