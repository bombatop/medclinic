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


    //configuration only works when specified in xml, IDK HOW TO FIX THIS
    
    // @Bean
    // public WebMvcConfigurer corsConfigurer() {
    //     return new WebMvcConfigurer() {
    //         @Override
    //         public void addCorsMappings(CorsRegistry registry) {
    //             registry.addMapping("/api/**")
    //             .allowedOrigins("http://localhost:4200")
    //             .allowedMethods("*")
    //             .allowedHeaders("Content-Type");
    //         }
    //     };
    // }
}