package courseproject.springbootbackend.service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class JournalAlreadyLinkedException extends RuntimeException {
    public JournalAlreadyLinkedException(String message) {
        super(message);
    }
}