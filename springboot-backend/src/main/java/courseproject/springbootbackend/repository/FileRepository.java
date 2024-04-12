package courseproject.springbootbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.FileEntity;

@Repository
public interface FileRepository extends JpaRepository<FileEntity, Integer> {
    
    FileEntity findFileById(Integer id);
}