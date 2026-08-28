package com.addressbook.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Data
public class Contact {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "First name is required")
    @Column(name = "first_name", length = 50, nullable = false)
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Column(name = "last_name", length = 50, nullable = false)
    private String lastName;
    
    @NotBlank(message = "Email address is required")
    @Email(message = "Invalid email format")
    @Column(name = "email_address", length = 100, nullable = false)
    private String email;
    
    @NotBlank(message = "Phone number is required")
    @Column(name = "phone_number", length = 20, nullable = false)
    private String phoneNumber;
    
    @NotBlank(message = "Address is required")
    @Column(name = "address", length = 255, nullable = false)
    private String address;
    
    @NotBlank(message = "Category is required")
    @Column(name = "category", length = 50, nullable = false)
    private String category;
}
