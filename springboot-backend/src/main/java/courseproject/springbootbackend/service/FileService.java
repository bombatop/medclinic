package courseproject.springbootbackend.service;

import courseproject.springbootbackend.configuration.ApplicationConfig;
import courseproject.springbootbackend.model.entity.FilepathEntity;
import courseproject.springbootbackend.model.entity.JournalEntity;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import courseproject.springbootbackend.repository.FilepathRepository;
import courseproject.springbootbackend.repository.JournalRepository;

@Service
public class FileService {
    @Autowired
    private JournalRepository journalRepo;
    @Autowired
    private FilepathRepository fileRepo;
    @Autowired
    private ApplicationConfig applicationConfig;

    public ResponseEntity<?> downloadFileById(Integer file_id) {
        try {
            String path = fileRepo.findFilepathById(file_id).getPath();
            byte[] fileData = Files.readAllBytes(Paths.get(path));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", fileRepo.findFilepathById(file_id).getName());
            headers.setContentLength(fileData.length);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(fileData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> uploadFilesByJournalId(Integer journalId, List<MultipartFile> multipartFiles) {
        try {
            String uploadPath = applicationConfig.getUploadPath();
            String storageFolderPath = uploadPath + File.separator + journalId + File.separator;
            File journalFolder = new File(storageFolderPath);
            if (!journalFolder.exists()) {
                journalFolder.mkdirs();
            }

            JournalEntity journal = journalRepo.findByFile(journalId);
            Set<FilepathEntity> updatedJournal = journal.getFiles();

            for (MultipartFile uploadedFile : multipartFiles) {
                String originalFilename = uploadedFile.getOriginalFilename();
                String uniqueFilename = generateUniqueFilename(originalFilename);

                Path path = Paths.get(storageFolderPath, uniqueFilename);
                uploadedFile.transferTo(path.toFile());

                FilepathEntity newFile = new FilepathEntity();
                newFile.setPath(storageFolderPath + uniqueFilename);
                newFile.setName(originalFilename);
                newFile = fileRepo.save(newFile);
                updatedJournal.add(newFile);
            }

            journal.setFiles(updatedJournal);
            journalRepo.save(journal);

            return ResponseEntity.status(HttpStatus.OK).body(journal.getFiles());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> deleteFileForJournal(Integer id) {
        try {
            String pathToDelete = fileRepo.findFilepathById(id).getPath();
            JournalEntity journal = journalRepo.findByFile(id);
            journal.getFiles().removeIf(file -> file.getId().equals(id));
            journalRepo.save(journal);

            File dir = new File(pathToDelete);
            if (dir.exists()) {
                dir.delete();
            }
            fileRepo.deleteById(id);

            return ResponseEntity.status(HttpStatus.OK).body(journal.getFiles());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    private String generateUniqueFilename(String originalFilename) {
        String timestamp = Instant.now().toString().replace(":", "_").replace(".", "_");
        String randomString = UUID.randomUUID().toString().replace("-", "");
        String extension = extractFileExtension(originalFilename);
        return timestamp + "_" + randomString + extension;
    }

    private String extractFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < filename.length() - 1) {
            return filename.substring(dotIndex);
        }
        return "";
    }
}
