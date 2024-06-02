package courseproject.springbootbackend.configuration.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private UserDetailsService userDetailsService;

    private JwtTokenUtil jwtTokenUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");


        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }
        final var jwtToken = authorizationHeader.substring(7);
        final var username = jwtTokenUtil.extractUsername(jwtToken);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            final var userDetails = userDetailsService.loadUserByUsername(username);
            if (jwtTokenUtil.validateToken(jwtToken, userDetails.getUsername())) {
                final var authenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }
        chain.doFilter(request, response);
    }
}