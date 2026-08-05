package com.example.addressbook.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(Long id) {
        super("Contact not found: " + id);
    }
}
