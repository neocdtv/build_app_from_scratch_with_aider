package com.example.addressbook.model.dto;
import java.time.LocalDateTime;

public record ContactDto(Long id, String firstName, String lastName, String email, 
                          String phoneNumber, String address, String category, 
                          LocalDateTime createdAt, LocalDateTime updatedAt) {}
