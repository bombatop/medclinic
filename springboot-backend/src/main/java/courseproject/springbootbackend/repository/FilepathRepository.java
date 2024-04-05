package courseproject.springbootbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.Filepath;

@Repository
public interface FilepathRepository extends JpaRepository<Filepath, Integer> {
    Filepath findFilepathById(Integer id);
}