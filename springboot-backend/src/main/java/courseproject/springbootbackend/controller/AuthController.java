package courseproject.springbootbackend.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import courseproject.springbootbackend.model.dto.authorization.UserSignin;
import courseproject.springbootbackend.configuration.security.JwtTokenUtil;
import courseproject.springbootbackend.model.dto.authorization.JwtAuthenticationResponse;
import courseproject.springbootbackend.model.dto.authorization.UserAuthModification;
import courseproject.springbootbackend.model.dto.authorization.UserBasicModification;
import courseproject.springbootbackend.model.dto.authorization.UserRoleModification;
import courseproject.springbootbackend.model.dto.authorization.UserSignup;
import courseproject.springbootbackend.model.entity.UserEntity;
import courseproject.springbootbackend.service.AuthenticationService;
import courseproject.springbootbackend.service.exception.UserHasNoRightException;
import courseproject.springbootbackend.utility.PathsUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = PathsUtils.AUTH_PATH)
public class AuthController {

    private final AuthenticationService authenticationService;

    private final JwtTokenUtil jwtTokenUtil;

    @PostMapping("/login")
    public JwtAuthenticationResponse login(
        @Valid @RequestBody UserSignin authCredentials, 
        HttpServletRequest request
    ) {
        return authenticationService.signIn(authCredentials);
    }

    @PostMapping("/signup")
    public JwtAuthenticationResponse signUp(@Valid @RequestBody UserSignup userData) {
        return authenticationService.signUp(userData);
    }
    
    @PutMapping("/update-auth")
    public JwtAuthenticationResponse updateUserAuthData(
            @Valid @RequestBody UserAuthModification userData,
            HttpServletRequest request
    ) {
        String token = request.getHeader("Authorization").substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(token);
        if (!username.equals(userData.username())) {
            throw new UserHasNoRightException();
        }
        return authenticationService.updateUserAuthData(userData);
    }

    @PutMapping("/update-info")
    public UserEntity updateUserBasicData(
            @Valid @RequestBody UserBasicModification userData,
            HttpServletRequest request
    ) {
        String token = request.getHeader("Authorization").substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(token);
        if (!username.equals(userData.username())) {
            throw new UserHasNoRightException();
        }
        return authenticationService.updateUserBasicData(userData);
    }

    @PutMapping("/update-role")
    public UserEntity updateUserRole(
            @Valid @RequestBody UserRoleModification userData,
            HttpServletRequest request
    ) {
        String token = request.getHeader("Authorization").substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(token);
        if (!username.equals(userData.username())) {
            throw new UserHasNoRightException();
        }
        return authenticationService.updateUserRole(userData);
    }
}