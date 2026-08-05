package com.example.addressbook.model.dto;
import jakarta.validation.constraints.*;

public record ContactCreateDto(
    @NotBlank @Size(max = 50) String firstName,
    @NotBlank @Size(max = 50) String lastName,
    @NotBlank @Email String email,
    @NotBlank @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$") String phoneNumber,
    @Size(max = 255) String address,
    @Size(max = 50) String category
) {}
