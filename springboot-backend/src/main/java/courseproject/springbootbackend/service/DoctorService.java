package courseproject.springbootbackend.service;

import courseproject.springbootbackend.mapper.DoctorMapper;
import courseproject.springbootbackend.model.dto.DoctorCreation;
import courseproject.springbootbackend.model.entity.DoctorEntity;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import courseproject.springbootbackend.repository.DoctorRepository;
import courseproject.springbootbackend.service.exception.DoctorNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(isolation = Isolation.READ_COMMITTED)
public class DoctorService {

    private final DoctorRepository doctorRepository;

    private final DoctorMapper doctorMapper;
    
    public List<DoctorEntity> getAllDoctors() {
        return doctorRepository.findAll();
    }
    
    public Page<DoctorEntity> getAllDoctors(final Pageable pageable) {
        return doctorRepository.findAll(pageable);
    }

    public Page<DoctorEntity> getDoctors(final String searchQuery, final Pageable pageable) {
        return doctorRepository.findByNameContaining(searchQuery, pageable);
    }

    public DoctorEntity getDoctorById(final Integer id) {
        return doctorRepository.findDoctorById(id);
    }

    public DoctorEntity addDoctor(final DoctorCreation dto) {
        var doctorEntity = doctorMapper.map(dto);
        try {
            doctorEntity = doctorRepository.save(doctorEntity);
            return doctorEntity;
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException(e.getMessage()); // change later
        }
    }

    public DoctorEntity updateDoctor(final Integer id, DoctorCreation dto) {
        var doctorEntity = doctorRepository.findById(id).orElseThrow(DoctorNotFoundException::new);
        doctorEntity.setName(dto.name());
        doctorEntity.setPhoneNumber(dto.phoneNumber());
        try {
            doctorEntity = doctorRepository.save(doctorEntity);
            return doctorEntity;
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException(e.getMessage()); // change later
        }
    }

    public void deleteDoctor(final Integer id) {
        doctorRepository.deleteById(id);
    }
}