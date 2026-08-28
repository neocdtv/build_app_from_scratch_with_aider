package com.addressbook.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", length = 50)
    @NotBlank(message = "First name is required")
    private String firstName;

    @Column(name = "last_name", length = 50)
    @NotBlank(message = "Last name is required")
    private String lastName;

    @Column(name = "email", length = 100)
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @Column(name = "phone_number", length = 20)
    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @Column(name = "address", length = 255)
    @NotBlank(message = "Address is required")
    private String address;

    @Column(name = "category", length = 50)
    @NotBlank(message = "Category is required")
    private String category;
}
