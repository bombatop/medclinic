package courseproject.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.model.Doctor;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    Doctor findDoctorById(Integer id);

    @Query("SELECT d FROM Doctor d")
    List<Doctor> findDoctors();
    
    @Query("SELECT d FROM Doctor d")
    Page<Doctor> findDoctors(Pageable pageable);

    @Query("SELECT d FROM Doctor d WHERE d.name LIKE :searchQuery")
    Page<Doctor> findDoctors(@Param("searchQuery") String searchQuery, Pageable pageable);
}