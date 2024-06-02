package courseproject.springbootbackend.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import courseproject.springbootbackend.configuration.security.JwtAuthEntryPoint;
import courseproject.springbootbackend.configuration.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final JwtAuthEntryPoint authEntryPoint;

    private final JwtAuthFilter authFilter;

    @Bean
    public UserDetailsService userDetailsService(BCryptPasswordEncoder bCryptPasswordEncoder) {
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
        manager.createUser(User.withUsername("user")
                .password(bCryptPasswordEncoder.encode("userPass"))
                .roles("USER")
                .build());
        manager.createUser(User.withUsername("admin")
                .password(bCryptPasswordEncoder.encode("adminPass"))
                .roles("USER", "ADMIN")
                .build());
        return manager;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            HttpSecurity http,
            BCryptPasswordEncoder bCryptPasswordEncoder,
            UserDetailsService userDetailsService
    )
    throws Exception {
        AuthenticationManagerBuilder authManagerBuilder =  http.getSharedObject(AuthenticationManagerBuilder.class);
        authManagerBuilder.userDetailsService(userDetailsService)
            .passwordEncoder(bCryptPasswordEncoder);
        return authManagerBuilder.build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(final HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.DELETE).hasRole("ADMIN")
                        .requestMatchers("/**").permitAll()
                        .anyRequest().authenticated())
                .exceptionHandling(handling -> handling.authenticationEntryPoint(authEntryPoint))
                .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}