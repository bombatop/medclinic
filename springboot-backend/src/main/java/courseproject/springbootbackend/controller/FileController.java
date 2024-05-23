package courseproject.springbootbackend.controller;

import java.util.List;
import java.util.Set;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import courseproject.springbootbackend.model.entity.FileEntity;
import courseproject.springbootbackend.service.FileService;
import courseproject.springbootbackend.utility.PathsUtils;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = PathsUtils.FILES_PATH)
@RequiredArgsConstructor
public class FileController {
    
    private final FileService fileService;

    @RequestMapping("{id}")
    public byte[] downloadFileById(@PathVariable Integer id) {
        return fileService.downloadFileById(id);
    }
    
    @PostMapping("{id}")
    public Set<FileEntity> uploadFilesByJournalId(
            @PathVariable Integer id,
            @RequestParam("files") List<MultipartFile> files) {
        return fileService.uploadFilesByJournalId(id, files);
    }

    @DeleteMapping("{id}")
    public void deleteFile(@PathVariable Integer id) {
        fileService.deleteFile(id);
    }
}
