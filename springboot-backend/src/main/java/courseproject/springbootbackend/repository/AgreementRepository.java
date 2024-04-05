package courseproject.springbootbackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.AgreementEntity;

@Repository
public interface AgreementRepository extends JpaRepository<AgreementEntity, Integer> {
    
    AgreementEntity findAgreementById(Integer id);

    List<AgreementEntity> findAll();

    AgreementEntity findAgreementByPatientId(Integer id);
}