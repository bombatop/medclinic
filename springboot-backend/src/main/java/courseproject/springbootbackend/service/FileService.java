package courseproject.springbootbackend.service;

import courseproject.springbootbackend.configuration.ApplicationConfig;
import courseproject.springbootbackend.model.entity.FileEntity;
import courseproject.springbootbackend.model.entity.JournalEntity;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;

// import org.springframework.http.HttpHeaders;
// import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import courseproject.springbootbackend.repository.FileRepository;
import courseproject.springbootbackend.repository.JournalRepository;
import courseproject.springbootbackend.service.exception.JournalNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(isolation = Isolation.READ_COMMITTED)
public class FileService {

    private final JournalRepository journalRepository;

    private final FileRepository fileRepository;

    private final ApplicationConfig applicationConfig;

    public byte[] downloadFileById(Integer id) {
        try {
            String path = fileRepository.findFileById(id).getPath();
            byte[] fileData = Files.readAllBytes(Paths.get(path));

            // HttpHeaders headers = new HttpHeaders();
            // headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            // headers.setContentDispositionFormData("attachment", fileRepository.findFileById(id).getName());
            // headers.setContentLength(fileData.length);
            // return ResponseEntity.ok()
            // .headers(headers)
            // .body(fileData);
            return fileData;
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage()); // change
        }
    }

    public Set<FileEntity> uploadFilesByJournalId(Integer journalId, List<MultipartFile> multipartFiles) {
        try {
            String storageFolderPath = applicationConfig.getUploadPath() + File.separator + journalId + File.separator;
            File journalFolder = new File(storageFolderPath);
            if (!journalFolder.exists()) {
                journalFolder.mkdirs();
            }
            var journalEntity = journalRepository.findById(journalId).orElseThrow(JournalNotFoundException::new);
            // var journalEntity = journalRepository.findByFilesId(journalId);
            Set<FileEntity> fileSet = journalEntity.getFiles();

            for (MultipartFile file : multipartFiles) {
                String originalFilename = file.getOriginalFilename();
                String uniqueFilename = generateUniqueFilename(originalFilename);

                Path path = Paths.get(storageFolderPath, uniqueFilename);
                file.transferTo(path.toFile());

                FileEntity newFile = new FileEntity();
                newFile.setPath(storageFolderPath + uniqueFilename);
                newFile.setName(originalFilename);
                newFile = fileRepository.save(newFile);
                fileSet.add(newFile);
            }

            journalEntity.setFiles(fileSet);
            journalRepository.save(journalEntity);
            return journalEntity.getFiles();
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    public void deleteFileForJournal(final Integer id) {
        try {
            String pathToDelete = fileRepository.findFileById(id).getPath();
            JournalEntity journalEntity = journalRepository.findById(id).orElseThrow(JournalNotFoundException::new);
            journalEntity.getFiles().removeIf(file -> file.getId().equals(id));
            journalRepository.save(journalEntity);

            File dir = new File(pathToDelete);
            if (dir.exists()) {
                dir.delete();
            }
            fileRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage()); //change
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
