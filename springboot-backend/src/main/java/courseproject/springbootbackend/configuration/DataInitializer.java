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
        if (roleRepository.findByName("USER").isEmpty()) {
            roleRepository.save(new RoleEntity(null, "USER"));
        }
        if (roleRepository.findByName("MANAGER").isEmpty()) {
            roleRepository.save(new RoleEntity(null, "MANAGER"));
        }
        if (roleRepository.findByName("DOCTOR").isEmpty()) {
            roleRepository.save(new RoleEntity(null, "DOCTOR"));
        }
        if (roleRepository.findByName("ADMIN").isEmpty()) {
            roleRepository.save(new RoleEntity(null, "ADMIN"));
        }
    }
}
