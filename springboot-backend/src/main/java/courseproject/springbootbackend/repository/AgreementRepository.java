package courseproject.springbootbackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.entity.Agreement;

@Repository
public interface AgreementRepository extends JpaRepository<Agreement, Integer> {
    @Query("SELECT a FROM Agreement a WHERE a.id = :id")
    Agreement findAgreementById(@Param("id") Integer id);

    @Query("SELECT a FROM Agreement a")
    List<Agreement> findAgreements();

    @Query("SELECT a FROM Agreement a JOIN Patient p WHERE p.id = :patientId")
    Agreement findAgreementsByPatientId(@Param("patientId") Integer id);
}