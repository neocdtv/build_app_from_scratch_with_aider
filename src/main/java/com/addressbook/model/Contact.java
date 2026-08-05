package com.addressbook.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "contacts")
public class Contact {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "First name is required")
    @Column(nullable = false, length = 50)
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Column(nullable = false, length = 50)
    private String lastName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(nullable = false, length = 100)
    private String email;
    
    @NotBlank(message = "Phone number is required")
    @Column(nullable = false, length = 20)
    private String phoneNumber;
    
    @NotBlank(message = "Address is required")
    @Column(nullable = false, length = 255)
    private String address;
    
    @NotBlank(message = "Category is required")
    @Column(nullable = false, length = 50)
    private String category;
    
    public Contact() {
    }
    
    public Contact(Long id, String firstName, String lastName, String email, 
                   String phoneNumber, String address, String category) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.category = category;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
}
