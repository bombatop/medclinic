package courseproject.springbootbackend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import courseproject.springbootbackend.mapper.PriceMapper;
import courseproject.springbootbackend.model.dto.BulkPriceUpdateData;
import courseproject.springbootbackend.model.dto.JournalReportDTO;
import courseproject.springbootbackend.model.dto.PriceData;
import courseproject.springbootbackend.model.dto.TreatmentPriceData;
import courseproject.springbootbackend.model.entity.PriceEntity;
import courseproject.springbootbackend.model.entity.AgencyEntity;
import courseproject.springbootbackend.model.entity.JournalDiagnosisEntity;
import courseproject.springbootbackend.model.entity.JournalEntity;
import courseproject.springbootbackend.model.entity.JournalTreatmentEntity;
import courseproject.springbootbackend.model.entity.TreatmentEntity;
import courseproject.springbootbackend.model.entity.UserEntity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import courseproject.springbootbackend.repository.AgencyRepository;
import courseproject.springbootbackend.repository.JournalRepository;
import courseproject.springbootbackend.repository.PriceRepository;
import courseproject.springbootbackend.repository.TreatmentRepository;
import courseproject.springbootbackend.service.exception.AgencyNotFoundException;
import courseproject.springbootbackend.service.exception.JournalNotFoundException;
import courseproject.springbootbackend.service.exception.TreatmentNotFoundException;
import courseproject.springbootbackend.service.specification.PriceSpecification;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(isolation = Isolation.READ_COMMITTED)
public class PriceService {
    
    private final PriceRepository priceRepository;

    private final JournalRepository journalRepository;
    
    private final TreatmentRepository treatmentRepository;

    private final AgencyRepository agencyRepository;

    private final PriceMapper priceMapper;

    public Page<PriceEntity> getPrices(Pageable pageable, Integer treatmentId, Integer agencyId, Boolean latestOnly) {
        Specification<PriceEntity> spec = PriceSpecification.pricesByAgencyAndTreatment(treatmentId, agencyId, latestOnly);
        return priceRepository.findAll(spec, pageable);
    }

    public PriceEntity addPriceForTreatment(final PriceData dto) {
        TreatmentEntity treatmentEntity = treatmentRepository.findById(dto.treatmentId())
                .orElseThrow(TreatmentNotFoundException::new);
        AgencyEntity agencyEntity = agencyRepository.findById(dto.agencyId())
                .orElseThrow(TreatmentNotFoundException::new);
        PriceEntity priceEntity = priceMapper.map(dto, treatmentEntity, agencyEntity);
        priceEntity = priceRepository.save(priceEntity);
        return priceEntity;
    }

    public List<PriceEntity> bulkUpdatePrices(final BulkPriceUpdateData dto) {
        AgencyEntity agencyEntity = agencyRepository.findById(dto.agencyId())
                .orElseThrow(AgencyNotFoundException::new);

        List<PriceEntity> priceEntities = new ArrayList<>();

        for (TreatmentPriceData treatmentPriceData : dto.prices()) {
            TreatmentEntity treatmentEntity = treatmentRepository.findById(treatmentPriceData.treatmentId())
                    .orElseThrow(TreatmentNotFoundException::new);
            PriceEntity priceEntity = priceMapper.map(treatmentPriceData, dto.date(), treatmentEntity, agencyEntity);
            priceEntities.add(priceEntity);
        }

        return priceRepository.saveAll(priceEntities);
    }

    public JournalReportDTO generateJournalReport(Integer journalId, List<Integer> agencyIds) {
        JournalEntity startJournal = journalRepository.findById(journalId)
                .orElseThrow(JournalNotFoundException::new);
        JournalReportDTO report = new JournalReportDTO();
        Set<JournalDiagnosisEntity> allDiagnoses = new HashSet<>();
        Map<Integer, JournalReportDTO.TreatmentReportData> allTreatments = new HashMap<>();
        Set<UserEntity> allDoctors = new HashSet<>();

        JournalEntity lastJournal = startJournal;
        while (lastJournal.getNextEntry() != null) {
            lastJournal = lastJournal.getNextEntry();
        }
        LocalDateTime lastJournalDate = lastJournal.getDate();

        JournalEntity current = lastJournal;
        while (current != null) {
            allDiagnoses.addAll(current.getDiagnoses());
            for (JournalTreatmentEntity treatment : current.getTreatments()) {
                allTreatments.computeIfAbsent(treatment.getTreatment().getId(), k -> {
                    JournalReportDTO.TreatmentReportData data = new JournalReportDTO.TreatmentReportData();
                    data.setTreatment(treatment.getTreatment());
                    data.setAmount(0);
                    data.setPrices(new HashMap<>());
                    return data;
                }).setAmount(allTreatments.get(treatment.getTreatment().getId()).getAmount() + treatment.getAmount());
            }
            allDoctors.add(current.getUser());
            current = current.getPrevEntry();
        }

        report.setPatient(startJournal.getPatient());
        report.setDoctors(new ArrayList<>(allDoctors));
        report.setDiagnoses(new ArrayList<>(allDiagnoses));
        report.setTreatments(calculateTreatmentPrices(allTreatments, agencyIds, lastJournalDate));
        return report;
    }

    private Map<Integer, JournalReportDTO.TreatmentReportData> calculateTreatmentPrices(
            Map<Integer, JournalReportDTO.TreatmentReportData> treatments,
            List<Integer> agencyIds,
            LocalDateTime lastJournalDate) {
        for (JournalReportDTO.TreatmentReportData treatmentData : treatments.values()) {
            for (Integer agencyId : agencyIds) {
                var priceEntity = priceRepository
                        .findLatestPriceByTreatmentAndDateAndAgency(treatmentData.getTreatment().getId(), agencyId, lastJournalDate);
                if (priceEntity != null) {
                    JournalReportDTO.TreatmentReportData.AgencyPriceData priceData = new JournalReportDTO.TreatmentReportData.AgencyPriceData();
                    priceData.setAgency(priceEntity.getAgency());
                    priceData.setPrice(priceEntity.getPrice());
                    treatmentData.getPrices().put(agencyId, priceData);
                }
            }
        }
        return treatments;
    }

    public void deletePrice(Integer id) {
        priceRepository.deleteById(id);
    }
}   