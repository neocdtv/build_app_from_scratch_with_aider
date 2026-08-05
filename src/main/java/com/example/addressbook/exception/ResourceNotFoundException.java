package com.example.addressbook.exception;

public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String message, Long id) {
        super(message + " (ID: " + id + ")");
    }
}
