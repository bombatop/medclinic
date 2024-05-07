package courseproject.springbootbackend.service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class JournalDiagnosisNotFoundException extends RuntimeException {

    public JournalDiagnosisNotFoundException() {
        super("Diagnosis for specified journal not found");
    }
}
