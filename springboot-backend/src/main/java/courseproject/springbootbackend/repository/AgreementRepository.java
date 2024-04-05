package courseproject.springbootbackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.AgreementEntity;

@Repository
public interface AgreementRepository extends JpaRepository<AgreementEntity, Integer> {
    @Query("SELECT a FROM Agreement a WHERE a.id = :id")
    AgreementEntity findAgreementById(@Param("id") Integer id);

    @Query("SELECT a FROM Agreement a")
    List<AgreementEntity> findAgreements();

    @Query("SELECT a FROM Agreement a JOIN Patient p WHERE p.id = :patientId")
    AgreementEntity findAgreementsByPatientId(@Param("patientId") Integer id);
}