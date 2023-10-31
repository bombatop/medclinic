package courseproject.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import courseproject.service.FileService;

@RestController
@RequestMapping("/api/files/")
public class FileController {
    @Autowired
    private FileService service;

    @RequestMapping("/download/{journal_id}/{file_id}")
    public ResponseEntity<?> downloadFilesByJournalId(
            @PathVariable("journal_id") Integer journal_id,
            @PathVariable("file_id") Integer file_id) {
        return service.downloadFileByJournalId(journal_id, file_id);
    }
    
    @PostMapping("/upload/{journal_id}")
    public ResponseEntity<?> uploadFilesByJournalId(
            @PathVariable ("journal_id") Integer journal_id,
            @RequestParam("files") List<MultipartFile> multipartFiles) {
        return service.uploadFilesByJournalId(journal_id, multipartFiles);
    }

    @DeleteMapping("/delete/{journal_id}/{file_id}")
    public ResponseEntity<?> deletePriceForJournal(
            @PathVariable("journal_id") Integer journal_id,
            @PathVariable("file_id") Integer file_id) {
        return service.deleteFileForJournal(journal_id, file_id);
    }
}
