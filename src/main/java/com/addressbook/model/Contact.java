package com.addressbook.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;

/**
 * Contact entity representing a person in the address book.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "contacts")
public class Contact implements Serializable {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 @Column(name = "id", nullable = false)
 private Long id;

 @NotBlank
 @Size(max = 50)
 @Column(name = "first_name", nullable = false, length = 50)
 private String firstName;

 @NotBlank
 @Size(max = 50)
 @Column(name = "last_name", nullable = false, length = 50)
 private String lastName;

 @NotBlank
 @Email
 @Size(max = 100)
 @Column(name = "email", nullable = false, length = 100)
 private String email;

 @NotBlank
 @Size(max = 20)
 @Column(name = "phone_number", nullable = false, length = 20)
 private String phoneNumber;

 @NotBlank
 @Size(max = 255)
 @Column(name = "address", nullable = false, length = 255)
 private String address;

 @NotBlank
 @Size(max = 50)
 @Column(name = "category", nullable = false, length = 50)
 private String category;

 // Lombok @Getter and @Setter are automatically generated
 // @Builder is for building objects
 // @Data includes @Getter, @Setter, @ToString, @EqualsAndHashCode, @HashCode
}
