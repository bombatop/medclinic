package courseproject.springbootbackend.controller;

import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import courseproject.springbootbackend.model.dto.UserData;
import courseproject.springbootbackend.model.dto.authorization.AuthCredentials;
import courseproject.springbootbackend.model.dto.authorization.JwtAuthenticationResponse;
import courseproject.springbootbackend.service.AuthenticationService;
import courseproject.springbootbackend.utility.PathsUtils;
import jakarta.validation.Valid;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = PathsUtils.AUTH_PATH)
public class AuthController {

    private final AuthenticationService authenticationService;
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

    @PostMapping("/login")
    public JwtAuthenticationResponse login(@Valid @RequestBody AuthCredentials authCredentials) {
        logger.info("UserData controller logger: " + authCredentials.username() + "#" + authCredentials.password());
        return authenticationService.signIn(authCredentials);
    }

    @PostMapping("/signup")
    public JwtAuthenticationResponse signUp(@RequestBody UserData userData) {
        logger.info(
                "UserData controller logger: " + userData.name() + "#" + userData.username() + "#" + userData.password());
        return authenticationService.signUp(userData);
    }
}