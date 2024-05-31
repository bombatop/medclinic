package courseproject.springbootbackend.service.specification;

import org.springframework.data.jpa.domain.Specification;

import courseproject.springbootbackend.model.entity.PriceEntity;

import java.time.LocalDateTime;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

public class PriceSpecification {

    public static Specification<PriceEntity> pricesByAgencyAndTreatment(Integer treatmentId, Integer agencyId,
            boolean latestOnly) {
        return (root, query, criteriaBuilder) -> {
            Predicate treatmentPredicate = treatmentId != null
                    ? criteriaBuilder.equal(root.get("treatment").get("id"), treatmentId)
                    : criteriaBuilder.conjunction();

            Predicate agencyPredicate = agencyId != null
                    ? criteriaBuilder.equal(root.get("agency").get("id"), agencyId)
                    : criteriaBuilder.conjunction();

            if (latestOnly) {
                Subquery<LocalDateTime> subquery = query.subquery(LocalDateTime.class);
                Root<PriceEntity> subRoot = subquery.from(PriceEntity.class);

                Predicate subqueryPredicate =
                        criteriaBuilder.equal(subRoot.get("treatment").get("id"), root.get("treatment").get("id"));
                subqueryPredicate = criteriaBuilder.and(subqueryPredicate,
                        criteriaBuilder.equal(subRoot.get("agency").get("id"), root.get("agency").get("id")));

                subquery.select(criteriaBuilder.greatest(subRoot.get("date"))).where(subqueryPredicate);

                Predicate mainPredicate = criteriaBuilder.equal(root.get("date"), subquery);
                return criteriaBuilder.and(mainPredicate, treatmentPredicate, agencyPredicate);
            } else {
                return criteriaBuilder.and(treatmentPredicate, agencyPredicate);
            }
        };
    }
}