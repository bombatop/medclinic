package courseproject.springbootbackend.service;

import courseproject.springbootbackend.mapper.PatientMapper;
import courseproject.springbootbackend.model.dto.PatientCreation;
import courseproject.springbootbackend.model.entity.PatientEntity;

import org.springframework.data.domain.Page;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import courseproject.springbootbackend.repository.PatientRepository;
import courseproject.springbootbackend.service.exception.PatientNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(isolation = Isolation.READ_COMMITTED)
public class PatientService {

    private final PatientRepository patientRepository;

    private final PatientMapper patientMapper;

    public Page<PatientEntity> getPatients(final String searchQuery, final Pageable pageable) {
        if (searchQuery == null || searchQuery.isEmpty()) {
            return patientRepository.findAll(pageable);
        } else {
            return patientRepository.searchPatients(searchQuery, pageable);
        }
    }

    public PatientEntity getPatientById(final Integer id) {
        return patientRepository.findById(id).orElseThrow(PatientNotFoundException::new);
    }

    public PatientEntity addPatient(final PatientCreation dto) {
        var patientEntity = patientMapper.map(dto);
        try {
            patientEntity = patientRepository.save(patientEntity);
            return patientEntity;
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException(e.getMessage()); // change later
        }
    }

    public PatientEntity updatePatient(final Integer id, PatientCreation dto) {
        var patientEntity = patientRepository.findById(id).orElseThrow(PatientNotFoundException::new);
        patientEntity.setName(dto.name());
        patientEntity.setSurname(dto.surname());
        patientEntity.setPatronymic(dto.patronymic());
        patientEntity.setPhoneNumber(dto.phoneNumber());
        try {
            patientEntity = patientRepository.save(patientEntity);
            return patientEntity;
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException(e.getMessage()); // change later
        }
    }

    public void deletePatient(final Integer id) {
        patientRepository.deleteById(id);
    }
}