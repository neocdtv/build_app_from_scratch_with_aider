package com.example.addressbook.model.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ContactUpdateDto {
    @Size(max = 50)
    private String firstName;
    @Size(max = 50)
    private String lastName;
    @Size(max = 255)
    private String address;
    @Size(max = 50)
    private String category;
}
