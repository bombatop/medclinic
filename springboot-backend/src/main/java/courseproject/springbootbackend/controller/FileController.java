package courseproject.springbootbackend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import courseproject.springbootbackend.service.FileService;
import courseproject.springbootbackend.utility.PathsUtils;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = PathsUtils.FILES_PATH)
@RequiredArgsConstructor
public class FileController {
    
    private final FileService service;

    @RequestMapping("{id}")
    public ResponseEntity<?> downloadFileById(@PathVariable("id") Integer id) {
        return service.downloadFileById(id);
    }
    
    @PostMapping("{id}")
    public ResponseEntity<?> uploadFilesByJournalId(@PathVariable ("id") Integer id, @RequestParam("files") List<MultipartFile> files) {
        return service.uploadFilesByJournalId(id, files);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteFileForJournal(@PathVariable("id") Integer id) {
        return service.deleteFileForJournal(id);
    }
}
