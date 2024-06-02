package courseproject.springbootbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import courseproject.springbootbackend.configuration.security.JwtTokenUtil;
import courseproject.springbootbackend.model.dto.JwtAuthenticationResponse;
import courseproject.springbootbackend.model.dto.JwtRequest;
import courseproject.springbootbackend.service.UserService;
import courseproject.springbootbackend.utility.PathsUtils;

@RestController
@RequestMapping(path = PathsUtils.WEBAPP_PATH)
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserService userService;

    @PostMapping("/auth")
    public JwtAuthenticationResponse createAuthenticationToken(@RequestBody JwtRequest authenticationRequest) throws Exception {
        authenticate(authenticationRequest.username(), authenticationRequest.password());
        final UserDetails userDetails = userService.loadUserByUsername(authenticationRequest.username());
        final String token = jwtTokenUtil.generateToken(userDetails);
        return new JwtAuthenticationResponse(token);
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }
}
