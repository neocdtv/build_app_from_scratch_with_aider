package com.example.addressbook.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import jakarta.validation.ValidationException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@org.springframework.web.annotation.ControllerAdvice
public class GlobalExceptionHandler {

    private static final DateTimeFormatter TIMESTAMP_FORMAT = 
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleResourceNotFound(ResourceNotFoundException ex) {
        return buildErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<?> handleValidationException(ValidationException ex) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGenericException(Exception ex) {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    }

    private ResponseEntity<?> buildErrorResponse(HttpStatus status, String message) {
        return new ResponseEntity<>(new ErrorDetail(LocalDateTime.now().format(TIMESTAMP_FORMAT), 
                                                    status.value(), 
                                                    status.getReasonPhrase(), 
                                                    message), status);
    }

    private static class ErrorDetail {
        private final String timestamp;
        private final int status;
        private final String error;
        private final String message;

        public ErrorDetail(String timestamp, int status, String error, String message) {
            this.timestamp = timestamp;
            this.status = status;
            this.error = error;
            this.message = message;
        }
    }
}
