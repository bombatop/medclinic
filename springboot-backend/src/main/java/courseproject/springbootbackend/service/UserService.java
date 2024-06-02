package courseproject.springbootbackend.service;

import courseproject.springbootbackend.mapper.UserMapper;
import courseproject.springbootbackend.model.dto.UserData;
import courseproject.springbootbackend.model.entity.UserEntity;

import java.util.Collections;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import courseproject.springbootbackend.repository.UserRepository;
import courseproject.springbootbackend.service.exception.UserNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(isolation = Isolation.READ_COMMITTED)
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    @PreAuthorize("hasRole('ROLE_USER')")
    public Page<UserEntity> getUsers(final String searchQuery, final Pageable pageable) {
        if (searchQuery == null || searchQuery.isEmpty()) {
            return userRepository.findAll(pageable);
        } else {
            return userRepository.searchUsers(searchQuery, pageable);
        }
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    public UserEntity getUserById(final Integer id) {
        return userRepository.findById(id).orElseThrow(UserNotFoundException::new);
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    public UserEntity getUserByEmail(final String email) {
        return userRepository.findByEmail(email).orElseThrow(UserNotFoundException::new);
    }

    public UserEntity updateUser(final Integer id, UserData dto) {
        var userEntity = userRepository.findById(id).orElseThrow(UserNotFoundException::new);
        userEntity.setName(dto.name());
        userEntity.setPhonenumber(dto.phonenumber());
        try {
            userEntity = userRepository.save(userEntity);
            return userEntity;
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    public void deleteUser(final Integer id) {
        userRepository.deleteById(id);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(user.getRole().getName()));
        
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }
}
