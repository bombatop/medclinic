package courseproject.springbootbackend.service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.FORBIDDEN)
public class UserHasNoRightException extends RuntimeException {

    public UserHasNoRightException() {
        super("User has no right for such action.");
    }
}
