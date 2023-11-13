package courseproject.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ApplicationConfig {
    
    // @Value("${upload.path}")
    @Value("C:\\Users\\biba\\Desktop\\qualification project\\CODE\\courseproject\\db_filestorage")
    private String uploadPath;

    public String getUploadPath() {
        return uploadPath;
    }
}