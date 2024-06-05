package courseproject.springbootbackend.service;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import courseproject.springbootbackend.configuration.security.JwtTokenUtil;
import courseproject.springbootbackend.mapper.TokenDataMapper;
import courseproject.springbootbackend.mapper.UserMapper;
import courseproject.springbootbackend.model.dto.authorization.UserSignin;
import courseproject.springbootbackend.model.dto.authorization.JwtAuthenticationResponse;
import courseproject.springbootbackend.model.dto.authorization.UserAuthModification;
import courseproject.springbootbackend.model.dto.authorization.UserBasicModification;
import courseproject.springbootbackend.model.dto.authorization.UserSignup;
import courseproject.springbootbackend.model.entity.UserEntity;
import courseproject.springbootbackend.repository.RoleRepository;
import courseproject.springbootbackend.repository.UserRepository;
import courseproject.springbootbackend.service.exception.EntityAlreadyExistsException;
import courseproject.springbootbackend.service.exception.RoleNotFoundException;
import courseproject.springbootbackend.service.exception.UserNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final JwtTokenUtil jwtTokenUtil;

    private final UserService userService;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    private final TokenDataMapper tokenDataMapper;
    private final UserMapper userMapper;

    public JwtAuthenticationResponse signIn(final UserSignin authCredentials) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authCredentials.username(), authCredentials.password()));
            final var userEntity = userService.getUserByUsername(authCredentials.username());
            final var tokenData = tokenDataMapper.map(userEntity);
            final var generatedToken = jwtTokenUtil.generateToken(tokenData);
            return new JwtAuthenticationResponse(generatedToken);
        } catch (BadCredentialsException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
    }

    public JwtAuthenticationResponse signUp(final UserSignup dto) {
        try {
            if (userRepository.findByUsername(dto.username()).isPresent()) {
                throw new EntityAlreadyExistsException("User with such username already exists");
            }
            final var roleEntity = roleRepository.findByName("USER").orElseThrow(RoleNotFoundException::new);
            var userEntity = userMapper.map(dto);
            userEntity.setRole(roleEntity);
            userEntity.setUsername(dto.username());
            userEntity.setPassword(passwordEncoder.encode(dto.password()));

            userEntity = userRepository.save(userEntity);
            
            final var tokenData = tokenDataMapper.map(userEntity);
            final var generatedToken = jwtTokenUtil.generateToken(tokenData);

            return new JwtAuthenticationResponse(generatedToken);
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
    }

    public JwtAuthenticationResponse updateUserAuthData(final UserAuthModification dto) {
        var userEntity = userRepository.findById(dto.userId()).orElseThrow(UserNotFoundException::new);
        if (dto.roleId() != null) {
            final var roleEntity = roleRepository.findById(dto.roleId()).orElseThrow(RoleNotFoundException::new);
            userEntity.setRole(roleEntity);
        }
        userEntity.setPassword(passwordEncoder.encode(dto.password()));

        final var tokenData = tokenDataMapper.map(userEntity);
        final var generatedToken = jwtTokenUtil.generateToken(tokenData);

        userEntity = userRepository.save(userEntity);
        return new JwtAuthenticationResponse(generatedToken);
    }

    public UserEntity updateUserBasicData(final UserBasicModification dto) {
        var userEntity = userRepository.findById(dto.userId()).orElseThrow(UserNotFoundException::new);
        
        userEntity = userMapper.map(userEntity, dto);

        userEntity = userRepository.save(userEntity);
        return userEntity;
    }
}