package com.example.addressbook.repository;

import com.example.addressbook.model.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import java.util.List;
import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    @Query("SELECT c FROM Contact c WHERE " +
           "(?search IS NULL OR LOWER(c.firstName) LIKE LOWER(CONCAT('%', ?search, '%')) " +
           "OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', ?search, '%')) " +
           "OR LOWER(c.category) LIKE LOWER(CONCAT('%', ?search, '%'))) " +
           "AND (?category IS NULL OR c.category = ?category)")
    List<Contact> search(String search, String category);

    Optional<Contact> findByEmailIgnoreCase(String email);

    Optional<Contact> findByPhoneNumber(String phoneNumber);
}
