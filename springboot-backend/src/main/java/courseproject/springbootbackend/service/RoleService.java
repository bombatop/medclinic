package courseproject.springbootbackend.service;

import courseproject.springbootbackend.model.entity.RoleEntity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import courseproject.springbootbackend.repository.RoleRepository;
import courseproject.springbootbackend.service.exception.RoleNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(isolation = Isolation.READ_COMMITTED)
public class RoleService {

    private final RoleRepository roleRepository;

    public Page<RoleEntity> getRoles(final String searchQuery, final Pageable pageable) {
        return roleRepository.findByNameContaining(searchQuery, pageable);
    }

    public RoleEntity getRoleById(final Integer id) {
        return roleRepository.findById(id).orElseThrow(RoleNotFoundException::new);
    }
}
