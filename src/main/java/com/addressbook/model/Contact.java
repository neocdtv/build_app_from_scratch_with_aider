package com.addressbook.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "contacts")
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "firstName is required")
    @Column(length = 50, nullable = false)
    private String firstName;

    @NotBlank(message = "lastName is required")
    @Column(length = 50, nullable = false)
    private String lastName;

    @NotBlank(message = "email is required")
    @Email(message = "must be a valid email address")
    @Column(length = 100, nullable = false)
    private String email;

    @NotBlank(message = "phoneNumber is required")
    @Column(length = 20, nullable = false)
    private String phoneNumber;

    @NotBlank(message = "address is required")
    @Column(length = 255, nullable = false)
    private String address;

    @NotBlank(message = "category is required")
    @Column(length = 50, nullable = false)
    private String category;

    public Contact() {
    }

    public Contact(String firstName, String lastName, String email,
                   String phoneNumber, String address, String category) {
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Contact contact)) {
            return false;
        }
        if (id == null || contact.id == null) {
            return false;
        }
        return id.equals(contact.id);
    }

    @Override
    public int hashCode() {
        return id == null ? super.hashCode() : id.hashCode();
    }

    @Override
    public String toString() {
        return "Contact{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", address='" + address + '\'' +
                ", category='" + category + '\'' +
                '}';
    }
}
