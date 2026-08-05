package com.example.addressbook.model.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ContactCreateDto {
    @NotBlank @Size(max = 50)
    private String firstName;
    @NotBlank @Size(max = 50)
    private String lastName;
    @Email @NotBlank
    private String email;
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$") @NotBlank
    private String phoneNumber;
    @Size(max = 255)
    private String address;
    @Size(max = 50)
    private String category;
}
