package courseproject.springbootbackend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.DoctorEntity;

@Repository
public interface DoctorRepository extends JpaRepository<DoctorEntity, Integer> {

    List<DoctorEntity> findAll();

    Page<DoctorEntity> findAll(Pageable pageable);

    Page<DoctorEntity> findByNameContaining(String searchQuery, Pageable pageable);
}