package com.example.addressbook.model.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactUpdateDto {

    @Size(max = 50)
    private String firstName;

    @Size(max = 50)
    private String lastName;

    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone must be in E.164 format")
    private String phoneNumber;

    private String address;
    private String category;
}
