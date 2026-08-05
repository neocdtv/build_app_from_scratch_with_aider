package com.example.addressbook.model.dto;
import jakarta.validation.constraints.*;

public record ContactUpdateDto(
    @Size(max = 50) String firstName,
    @Size(max = 50) String lastName,
    @Email String email,
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$") String phoneNumber,
    @Size(max = 255) String address,
    @Size(max = 50) String category
) {}
