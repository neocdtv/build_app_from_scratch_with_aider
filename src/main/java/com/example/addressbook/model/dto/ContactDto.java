package com.example.addressbook.model.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ContactDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String address;
    private String category;
    private LocalDateTime createdAt;
}
