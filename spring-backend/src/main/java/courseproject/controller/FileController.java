package courseproject.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.validation.BindingResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import courseproject.model.*;
import courseproject.service.FileService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/files/")
public class FileController {
    @Autowired
    private FileService service;

    @PostMapping("/upload/{journalId}")
    public ResponseEntity<?> uploadFilesByJournalId(
            @PathVariable ("journalId") Integer journalId,
            @RequestParam("files") List<MultipartFile> multipartFiles) {
        return service.uploadFilesByJournalId(journalId, multipartFiles);
    }
}
