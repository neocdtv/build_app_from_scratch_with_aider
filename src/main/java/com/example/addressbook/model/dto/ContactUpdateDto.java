package com.example.addressbook.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ContactUpdateDto {
    @Size(max = 50, message = "First name must be less than 50 characters")
    private String firstName;
    
    @Size(max = 50, message = "Last name must be less than 50 characters")
    private String lastName;
    
    @Email(message = "Email must be valid")
    private String email;
    
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone number must be in E.164 format")
    private String phoneNumber;
    
    @Size(max = 255, message = "Address must be less than 255 characters")
    private String address;
    
    @Size(max = 50, message = "Category must be less than 50 characters")
    private String category;
    
    public ContactUpdateDto() {}
    
    // Getters and setters
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
