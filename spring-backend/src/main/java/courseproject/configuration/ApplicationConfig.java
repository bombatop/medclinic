package courseproject.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationConfig {
    
    // @Value("${upload.path}")
    @Value("C:\\Users\\biba\\Desktop\\qualification project\\CODE\\courseproject\\db_filestorage")
    private String uploadPath;

    public String getUploadPath() {
        return uploadPath;
    }
}