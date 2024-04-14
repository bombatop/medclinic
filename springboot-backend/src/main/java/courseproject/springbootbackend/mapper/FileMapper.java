package courseproject.springbootbackend.mapper;

import org.springframework.stereotype.Component;
import courseproject.springbootbackend.model.entity.FileEntity;

@Component
public class FileMapper {

    public FileEntity map(final String name, final String path) {
        return FileEntity.builder()
                .name(name)
                .path(path)
                .build();
    }
}
