package courseproject.springbootbackend.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.Journal;

@Repository
public interface JournalRepository extends JpaRepository<Journal, Integer>{
    @Query("SELECT j FROM Journal j WHERE j.id = :id")
    Journal findJournalById(@Param("id") Integer id);

    @Query("SELECT j FROM Journal j")
    List<Journal> findJournals();

    @Query("SELECT j FROM Journal j WHERE j.date >= :startDate AND j.date <= :endDate ORDER BY j.date")
    List<Journal> findJournalsByDateRange(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
    
    @Query("SELECT j FROM Journal j JOIN j.patient p WHERE p.id = :id")
    List<Journal> findJournalsForPatient(@Param("id") Integer id);

    @Query("SELECT d, COUNT(j), SUM(p.price) " +
        "FROM Journal j JOIN j.doctor d JOIN j.prices p " +
        "WHERE d.id IN :doctorIds AND j.date >= :startDate AND j.date <= :endDate " +
        "GROUP BY d")
    List<Object[]> getReportPricesForDoctors(
        @Param("doctorIds") List<Integer> doctorIds,
        @Param("startDate") java.util.Date startDate,
        @Param("endDate") java.util.Date endDate);
   
}