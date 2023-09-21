package courseproject.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import courseproject.model.Complaint;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Integer> {
    Complaint findComplaintById(Integer id);

    @Query("SELECT d FROM Complaint d")
    List<Complaint> findComplaints();

    @Query("SELECT d FROM Complaint d")
    Page<Complaint> findComplaints(Pageable pageable);

    @Query("SELECT d FROM Complaint d WHERE d.firstName LIKE :searchQuery OR d.lastName LIKE :searchQuery")
    Page<Complaint> findComplaints(@Param("searchQuery") String searchQuery, Pageable pageable);
}