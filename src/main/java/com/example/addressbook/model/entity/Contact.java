package com.example.addressbook.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "contacts")
@Data
public class Contact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    @NotBlank @Size(max = 50)
    private String firstName;

    @Column(nullable = false, length = 50)
    @NotBlank @Size(max = 50)
    private String lastName;

    @Column(unique = true, nullable = false)
    @Email @NotBlank
    private String email;

    @Column(unique = true, nullable = false)
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$")
    @NotBlank
    private String phoneNumber;

    @Column(length = 255)
    @Size(max = 255)
    private String address;

    @Column(length = 50)
    @Size(max = 50)
    private String category;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
