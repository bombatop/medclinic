package courseproject.springbootbackend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.DoctorEntity;

@Repository
public interface DoctorRepository extends JpaRepository<DoctorEntity, Integer> {
    DoctorEntity findDoctorById(Integer id);

    @Query("SELECT d FROM Doctor d")
    List<DoctorEntity> findDoctors();
    
    @Query("SELECT d FROM Doctor d")
    Page<DoctorEntity> findDoctors(Pageable pageable);

    @Query("SELECT d FROM Doctor d WHERE d.name LIKE :searchQuery")
    Page<DoctorEntity> findDoctors(@Param("searchQuery") String searchQuery, Pageable pageable);
}