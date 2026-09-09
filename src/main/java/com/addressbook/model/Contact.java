package com.addressbook.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "contacts")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "First name is required", groups = ValidationGroups.class, size = 50)
    @Column(length = 50)
    private String firstName;

    @NotBlank(message = "Last name is required", groups = ValidationGroups.class, size = 50)
    @Column(length = 50)
    private String lastName;

    @NotBlank(message = "Email is required", groups = ValidationGroups.class)
    @Email(message = "Must be a valid email address")
    @Column(length = 100)
    private String email;

    @NotBlank(message = "Phone number is required", groups = ValidationGroups.class, size = 20)
    @Column(length = 20)
    private String phoneNumber;

    @NotBlank(message = "Address is required", groups = ValidationGroups.class, length = 255)
    @Column(length = 255)
    private String address;

    @NotBlank(message = "Category/Tag is required", groups = ValidationGroups.class, length = 50)
    @Column(length = 50)
    private String category;
}
