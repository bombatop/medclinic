package courseproject.springbootbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.FilepathEntity;

@Repository
public interface FilepathRepository extends JpaRepository<FilepathEntity, Integer> {
    
    FilepathEntity findFilepathById(Integer id);
}