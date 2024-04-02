package courseproject.springbootbackend.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.springbootbackend.model.Journal;

@Repository
public interface JournalRepository extends JpaRepository<Journal, Integer> {
    @Query("SELECT j FROM Journal j WHERE j.id = :id")
    Journal findJournalById(@Param("id") Integer id);

    @Query("SELECT j FROM Journal j")
    List<Journal> findJournals();

    @Query("SELECT j FROM Journal j JOIN j.files f WHERE f.id = :id")
    Journal findJournalByFileId(@Param("id") Integer id); //throw exception for multiple results (which is not possible but still?)

    @Query("SELECT j FROM Journal j WHERE j.date >= :startDate AND j.date <= :endDate ORDER BY j.date")
    List<Journal> findJournalsByDateRange(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
    
    @Query("SELECT j FROM Journal j JOIN j.patient p WHERE p.id = :id")
    List<Journal> findJournalsForPatient(@Param("id") Integer id); 
}