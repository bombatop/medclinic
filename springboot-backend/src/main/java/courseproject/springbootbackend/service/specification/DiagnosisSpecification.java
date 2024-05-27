package courseproject.springbootbackend.service.specification;

import org.springframework.data.jpa.domain.Specification;

import courseproject.springbootbackend.model.entity.DiagnosisEntity;
import jakarta.persistence.criteria.Predicate;

public class DiagnosisSpecification {

    public static Specification<DiagnosisEntity> getDiagnoses(String searchQuery) {
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();

            if (searchQuery != null && !searchQuery.isEmpty()) {
                String searchPattern = "%" + searchQuery + "%";
                Predicate namePredicate = criteriaBuilder.like(root.get("name"), searchPattern);
                Predicate codePredicate = criteriaBuilder.like(root.get("code"), searchPattern);
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.or(namePredicate, codePredicate));
            }

            return predicate;
        };
    }
}
