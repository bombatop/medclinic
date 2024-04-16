package courseproject.springbootbackend.mapper;

import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import courseproject.springbootbackend.model.entity.FileEntity;

@Component
public class FileMapper {

     public FileEntity map(MultipartFile file) throws IOException {
        return FileEntity.builder()
                .name(file.getOriginalFilename())
                .data(file.getBytes())
                .uploadDate(LocalDateTime.now())
                .fileSize(file.getSize())
                .contentType(file.getContentType())
                .build();
    }
}
