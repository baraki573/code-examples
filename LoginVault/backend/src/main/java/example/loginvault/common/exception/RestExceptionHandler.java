package example.loginvault.common.exception;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.fileupload.impl.SizeLimitExceededException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
@Slf4j
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "Illegal Argument")
    protected void handleIllegalArgument(IllegalArgumentException ex, WebRequest request) {
        log.error("%s: %s".formatted(request.getDescription(false), ex.getMessage()));
    }

    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Entity not found")
    protected void handleNotFound(EntityNotFoundException ex, WebRequest request) {
        log.error("%s: %s".formatted(request.getDescription(false), ex.getMessage()));
    }

    @ExceptionHandler(SizeLimitExceededException.class)
    @ResponseStatus(value = HttpStatus.PAYLOAD_TOO_LARGE, reason = "Size Limit Exceeded")
    public void handleSizeLimit(SizeLimitExceededException ex, WebRequest request) {
        log.error("%s: %s".formatted(request.getDescription(false), ex.getMessage()));
    }
}
