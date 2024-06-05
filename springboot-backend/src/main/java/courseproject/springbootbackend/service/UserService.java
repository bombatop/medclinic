package courseproject.springbootbackend.service;

import courseproject.springbootbackend.model.entity.UserEntity;

import java.util.Collections;
import java.util.List;
import org.springframework.security.core.userdetails.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    // private final UserMapper userMapper;

    public Page<UserEntity> getUsers(final String searchQuery, final Pageable pageable) {
        Page<UserEntity> users = (searchQuery == null || searchQuery.isEmpty())
                ? userRepository.findAll(pageable)
                : userRepository.searchUsers(searchQuery, pageable);
        return users;
    }

    public UserEntity getUserById(final Integer id) {
        return userRepository.findById(id).orElseThrow(UserNotFoundException::new);
    }

    public UserEntity getUserByUsername(final String username) {
        return userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);
    }

    public void deleteUser(final Integer id) {
        userRepository.deleteById(id);
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        UserEntity user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        
        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().getName()));
        
        return new User(
                user.getUsername(),
                user.getPassword(),
                authorities
        ); 
    }
}
