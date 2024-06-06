package courseproject.springbootbackend.service.specification;

import org.springframework.data.jpa.domain.Specification;

import courseproject.springbootbackend.model.entity.UserEntity;
import jakarta.persistence.criteria.Predicate;

public class UserSpecification {
    public static Specification<UserEntity> getUsers(String searchQuery, Boolean isSpecialist) {
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();

            if (searchQuery != null && !searchQuery.isEmpty()) {
                String searchPattern = "%" + searchQuery.toLowerCase() + "%";
                Predicate searchPredicate = criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("surname")), searchPattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchPattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("patronymic")), searchPattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), searchPattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("username")), searchPattern)
                );
                predicate = criteriaBuilder.and(predicate, searchPredicate);
            }

            if (Boolean.TRUE.equals(isSpecialist)) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.isNotNull(root.get("specialty")));
            }

            return predicate;
        };
    }
}
