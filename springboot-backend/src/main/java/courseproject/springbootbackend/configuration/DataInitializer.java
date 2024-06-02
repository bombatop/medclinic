package courseproject.springbootbackend.configuration;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import courseproject.springbootbackend.model.entity.RoleEntity;
import courseproject.springbootbackend.repository.RoleRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public DataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.findByName("ROLE_USER").isEmpty()) {
            roleRepository.save(new RoleEntity(null, "ROLE_USER"));
        }
        if (roleRepository.findByName("ROLE_REGISTRATOR").isEmpty()) {
            roleRepository.save(new RoleEntity(null, "ROLE_REGISTRATOR"));
        }
        if (roleRepository.findByName("ROLE_DOCTOR").isEmpty()) {
            roleRepository.save(new RoleEntity(null, "ROLE_DOCTOR"));
        }
        if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
            roleRepository.save(new RoleEntity(null, "ROLE_ADMIN"));
        }
    }
}
