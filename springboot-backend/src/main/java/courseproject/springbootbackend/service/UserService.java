package courseproject.springbootbackend.service;

import courseproject.springbootbackend.mapper.UserMapper;
import courseproject.springbootbackend.model.dto.UserData;
import courseproject.springbootbackend.model.entity.UserEntity;


import org.springframework.data.domain.Page;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import courseproject.springbootbackend.repository.UserRepository;
import courseproject.springbootbackend.service.exception.UserNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(isolation = Isolation.READ_COMMITTED)
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByEmailOrPhonenumber(username, username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email or phone: " + username));

        return new User(
                user.getEmail(),
                user.getPassword(),
                user.getRoles().stream()
                        .map(role -> new SimpleGrantedAuthority(role.getName()))
                        .collect(Collectors.toList()));
    }

    public Page<UserEntity> getUsers(final String searchQuery, final Pageable pageable) {
        if (searchQuery == null || searchQuery.isEmpty()) {
            return userRepository.findAll(pageable);
        } else {
            return userRepository.searchUsers(searchQuery, pageable);
        }
    }

    public UserEntity getUserById(final Integer id) {
        return userRepository.findById(id).orElseThrow(UserNotFoundException::new);
    }

    public UserEntity addUser(final UserData dto) {
        var userEntity = userMapper.map(dto);
        try {
            userEntity = userRepository.save(userEntity);
            return userEntity;
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException(e.getMessage()); // change later
        }
    }

    public UserEntity updateUser(final Integer id, UserData dto) {
        var userEntity = userRepository.findById(id).orElseThrow(UserNotFoundException::new);
        userEntity.setName(dto.name());
        userEntity.setPhonenumber(dto.phonenumber());
        try {
            userEntity = userRepository.save(userEntity);
            return userEntity;
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException(e.getMessage()); // change later
        }
    }

    public void deleteUser(final Integer id) {
        userRepository.deleteById(id);
    }
}
