package courseproject.springbootbackend.service;

import courseproject.springbootbackend.configuration.ApplicationConfig;
import courseproject.springbootbackend.mapper.FileMapper;
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
import courseproject.springbootbackend.service.exception.FileNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(isolation = Isolation.READ_COMMITTED)
public class FileService {

    private final JournalRepository journalRepository;

    private final FileRepository fileRepository;

    private final ApplicationConfig applicationConfig;

    private final FileMapper fileMapper;

    public byte[] downloadFileById(Integer id) {
        try {
            String path = fileRepository.findById(id).orElseThrow(FileNotFoundException::new).getPath();
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

                FileEntity fileEntity = fileMapper.map(originalFilename, storageFolderPath + uniqueFilename);
                fileEntity = fileRepository.save(fileEntity);
                fileSet.add(fileEntity);
            }

            journalEntity.setFiles(fileSet);
            journalRepository.save(journalEntity);
            return journalEntity.getFiles();
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    public void deleteFile(final Integer id) {
        try {
            FileEntity fileEntity = fileRepository.findById(id).orElseThrow(FileNotFoundException::new);
            JournalEntity journalEntity = journalRepository.findByFileId(id); //assuming file does not exist w/o journal (meaning cascade is implemented)
            journalEntity.getFiles().removeIf(file -> file.getId().equals(id));
            journalRepository.save(journalEntity);

            File dir = new File(fileEntity.getPath());
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
