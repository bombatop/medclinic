package courseproject.springbootbackend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.DoctorEntity;

@Repository
public interface DoctorRepository extends JpaRepository<DoctorEntity, Integer> {

    @Query("SELECT d FROM DoctorEntity d WHERE d.surname LIKE %:searchQuery% OR " +
           "d.name LIKE %:searchQuery% OR d.patronymic LIKE %:searchQuery%")
    Page<DoctorEntity> searchDoctors(@Param("searchQuery") String searchQuery, Pageable pageable);
}