package courseproject.springbootbackend.service.specification;

import org.springframework.data.jpa.domain.Specification;

import courseproject.springbootbackend.model.entity.PriceEntity;

import java.time.LocalDateTime;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

public class PriceSpecification {

    public static Specification<PriceEntity> pricesByAgencyAndTreatment(String searchQuery, Integer agencyId,
            boolean latestOnly) {
        return (root, query, criteriaBuilder) -> {
            Predicate treatmentNamePredicate = criteriaBuilder.like(root.get("treatment").get("name"),
                    "%" + searchQuery + "%");
            Predicate treatmentCodePredicate = criteriaBuilder.like(root.get("treatment").get("code"),
                    "%" + searchQuery + "%");
            Predicate searchPredicate = criteriaBuilder.or(treatmentNamePredicate, treatmentCodePredicate);

            Predicate agencyPredicate = agencyId != null
                    ? criteriaBuilder.equal(root.get("agency").get("id"), agencyId)
                    : criteriaBuilder.conjunction();

            if (latestOnly) {
                Subquery<LocalDateTime> subquery = query.subquery(LocalDateTime.class);
                Root<PriceEntity> subRoot = subquery.from(PriceEntity.class);

                Predicate subqueryPredicate = criteriaBuilder.equal(subRoot.get("treatment"), root.get("treatment"));
                if (agencyId != null) {
                    subqueryPredicate = criteriaBuilder.and(subqueryPredicate,
                            criteriaBuilder.equal(subRoot.get("agency").get("id"), agencyId));
                } else {
                    subqueryPredicate = criteriaBuilder.and(subqueryPredicate,
                            criteriaBuilder.equal(subRoot.get("agency"), root.get("agency")));
                }

                subquery.select(criteriaBuilder.greatest(subRoot.get("date"))).where(subqueryPredicate);

                Predicate mainPredicate = criteriaBuilder.equal(root.get("date"), subquery);
                return criteriaBuilder.and(mainPredicate, searchPredicate, agencyPredicate);
            } else {
                return criteriaBuilder.and(searchPredicate, agencyPredicate);
            }
        };
    }
}