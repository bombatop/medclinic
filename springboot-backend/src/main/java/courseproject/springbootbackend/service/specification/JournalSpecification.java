package courseproject.springbootbackend.service.specification;

import org.springframework.data.jpa.domain.Specification;

import courseproject.springbootbackend.model.entity.JournalEntity;

import java.time.LocalDateTime;
import jakarta.persistence.criteria.Predicate;

public class JournalSpecification {

    public static Specification<JournalEntity> getJournals(Integer doctorId, Integer patientId, LocalDateTime start, LocalDateTime end) {
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();

            if (doctorId != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("doctor").get("id"), doctorId));
            }

            if (patientId != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("patient").get("id"), patientId));
            }

            if (start != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.greaterThanOrEqualTo(root.get("date"), start));
            }

            if (end != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.lessThanOrEqualTo(root.get("date"), end));
            }

            return predicate;
        };
    }
}
