package courseproject.springbootbackend.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.expression.SecurityExpressionHandler;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.expression.DefaultWebSecurityExpressionHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import courseproject.springbootbackend.configuration.security.JwtAuthEntryPoint;
import courseproject.springbootbackend.configuration.security.JwtAuthFilter;
import courseproject.springbootbackend.utility.PathsUtils;
import lombok.RequiredArgsConstructor;

@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = false, securedEnabled = false, jsr250Enabled = false)
@Configuration
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    private final JwtAuthEntryPoint jwtAuthEntryPoint;

    private final UserDetailsService userDetailsService;

    private final PasswordEncoder passwordEncoder;

    @Bean
    public SecurityFilterChain securityFilterChain(final HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(request -> request
                        .requestMatchers(PathsUtils.AUTH_PATH + "/**").permitAll()
                        .requestMatchers(HttpMethod.GET).hasRole("USER")
                        .requestMatchers(HttpMethod.DELETE).hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST).hasRole("DOCTOR")
                        .requestMatchers(HttpMethod.PUT).hasRole("DOCTOR")
                        .requestMatchers(HttpMethod.GET, PathsUtils.JOURNALS_PATH + "/**").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, PathsUtils.PATIENTS_PATH + "/**").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, PathsUtils.JOURNALS_PATH + "/**").hasRole("MANAGER")
                        .requestMatchers(HttpMethod.POST, PathsUtils.PATIENTS_PATH + "/**").hasRole("MANAGER")
                        .requestMatchers(HttpMethod.PUT, PathsUtils.JOURNALS_PATH + "/**").hasRole("MANAGER")
                        .requestMatchers(HttpMethod.PUT, PathsUtils.PATIENTS_PATH + "/**").hasRole("MANAGER")
                        .anyRequest().authenticated())
                .exceptionHandling(handling -> handling
                        .authenticationEntryPoint(jwtAuthEntryPoint))
                .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        final var authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(final AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public RoleHierarchy roleHierarchy() {
        String hierarchy = "ROLE_ADMIN > ROLE_DOCTOR > ROLE_MANAGER > ROLE_USER";
        RoleHierarchyImpl roleHierarchy = RoleHierarchyImpl.fromHierarchy(hierarchy);
        return roleHierarchy;
    }

    @Bean
    public SecurityExpressionHandler<FilterInvocation> customWebSecurityExpressionHandler() {
        DefaultWebSecurityExpressionHandler expressionHandler = new DefaultWebSecurityExpressionHandler();
        expressionHandler.setRoleHierarchy(roleHierarchy());
        return expressionHandler;
    }
}