spring:
  application:
    name: addressbook
  datasource:
    url: jdbc:h2:mem:addressbook
    driverClassName: org.h2.Driver
    username: sa
    password:
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: create-drop
    open-in-view: false
  h2:
    console:
      enabled: true
      path: /h2-console
  sql:
    init:
      mode: always
      continue-on-error: true
server:
  port: 8080
````

I notice I need to create the pom.xml file. Let me create all the necessary files:

First, I'll create the pom.xml file:

CODER.md
````xml
<<<<<<< SEARCH
package com.example.addressbook.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "contacts",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = "email"),
           @UniqueConstraint(columnNames = "phoneNumber")
       })
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String firstName;

    @NotBlank
    @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String lastName;

    @NotBlank
    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$")
    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Column(length = 255)
    private String address;

    @Column(length = 50)
    private String category;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
