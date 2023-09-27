package courseproject.service;

import courseproject.configuration.ApplicationConfig;
import courseproject.model.Journal;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import javax.ws.rs.core.Response;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import courseproject.repository.DoctorRepository;
import courseproject.repository.JournalRepository;
import lombok.Value;

@Service
public class FileUploadService {
    @Autowired
    private JournalRepository journalRepo;
    @Autowired
    private ApplicationConfig applicationConfig;

    public ResponseEntity<?> uploadFilesByJournalId(Integer journalId, List<MultipartFile> multipartFiles) {
        try {
            String uploadPath = applicationConfig.getUploadPath();
            String journalFolderPath = uploadPath + File.separator + journalId;

            File journalFolder = new File(journalFolderPath);
            if (!journalFolder.exists()) {
                journalFolder.mkdirs();
            }

            Journal journal = journalRepo.findJournalById(journalId);
            Set<String> updatedFilePaths = journal.getFilePaths();

            for (MultipartFile file : multipartFiles) {
                Path filePath = Paths.get(journalFolderPath, file.getOriginalFilename());
                file.transferTo(filePath.toFile());
                updatedFilePaths.add(journalId + File.separator + file.getOriginalFilename());
            }

            journal.setFilePaths(updatedFilePaths);
            journalRepo.save(journal);
            
            return ResponseEntity.status(HttpStatus.OK).body("All files uploaded successfully");
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
