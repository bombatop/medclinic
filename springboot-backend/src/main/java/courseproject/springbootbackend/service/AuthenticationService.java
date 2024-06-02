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
import courseproject.springbootbackend.model.dto.UserData;
import courseproject.springbootbackend.model.dto.authorization.AuthCredentials;
import courseproject.springbootbackend.model.dto.authorization.JwtAuthenticationResponse;
import courseproject.springbootbackend.repository.RoleRepository;
import courseproject.springbootbackend.repository.UserRepository;
import courseproject.springbootbackend.service.exception.EntityAlreadyExistsException;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

    private final JwtTokenUtil jwtTokenUtil;

    private final UserService userService;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    private final TokenDataMapper tokenDataMapper;
    private final UserMapper userMapper;

    public JwtAuthenticationResponse signIn(final AuthCredentials authCredentials) {
        logger.info("generatedToken: " + authCredentials.email() + " " + authCredentials.password());
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authCredentials.email(), authCredentials.password()));
            final var userEntity = userService.getUserByEmail(authCredentials.email());
            final var tokenData = tokenDataMapper.map(userEntity);
            final var generatedToken = jwtTokenUtil.generateToken(tokenData);
            logger.info("generatedToken: " + generatedToken);
            return new JwtAuthenticationResponse(generatedToken);
        } catch (BadCredentialsException e) {
            System.out.println(e.getMessage());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
    }

    public JwtAuthenticationResponse signUp(final UserData userData) {
            if (userRepository.findByEmail(userData.email()).isPresent()) {
                throw new EntityAlreadyExistsException("User with such email already exists");   
            };
            var userEntity = userMapper.map(userData);

            final var roleEntity = roleRepository.findByName("User");
            userEntity.setRole(roleEntity);
            userEntity.setPassword(passwordEncoder.encode(userData.password()));

            userEntity = userRepository.save(userEntity);

            final var tokenData = tokenDataMapper.map(userEntity);
            final var generatedToken = jwtTokenUtil.generateToken(tokenData);
            logger.info("Generated Token: {}", generatedToken);
            return new JwtAuthenticationResponse(generatedToken);
    }
}