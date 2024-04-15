package courseproject.springbootbackend.service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class JournalTreatmentNotFoundException extends RuntimeException {

    public JournalTreatmentNotFoundException() {
        super("Treatment for specified journal not found");
    }
}
