package courseproject.springbootbackend.service;

import courseproject.springbootbackend.mapper.FileMapper;
import courseproject.springbootbackend.model.entity.FileEntity;
import courseproject.springbootbackend.model.entity.JournalEntity;

import java.io.IOException;
import java.util.List;
import java.util.Set;
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


    private final FileMapper fileMapper;

    public byte[] downloadFileById(final Integer id) {
        var fileEntity = fileRepository.findById(id).orElseThrow(FileNotFoundException::new);
        return fileEntity.getData(); 
    }

    public Set<FileEntity> uploadFilesByJournalId(final Integer journalId, final List<MultipartFile> files) {
        var journalEntity = journalRepository.findById(journalId).orElseThrow(JournalNotFoundException::new);
        Set<FileEntity> journalFileEntities = journalEntity.getFiles();

        for (MultipartFile file : files) {
            try {
                FileEntity fileEntity = fileMapper.map(file);
                fileEntity = fileRepository.save(fileEntity);
                journalFileEntities.add(fileEntity);
            } catch (IOException e) {
                throw new RuntimeException("Error processing file upload: " + e.getMessage());
            }
        }
        journalEntity.setFiles(journalFileEntities);
        journalRepository.save(journalEntity);
        return journalFileEntities;
    }

    public void deleteFile(final Integer id) {
        FileEntity file = fileRepository.findById(id)
                .orElseThrow(FileNotFoundException::new);
        JournalEntity journal = journalRepository.findByFilesContains(file)
                .orElseThrow(FileNotFoundException::new);

        journal.getFiles().remove(file);
        journalRepository.save(journal);
        fileRepository.delete(file);
    }
}
