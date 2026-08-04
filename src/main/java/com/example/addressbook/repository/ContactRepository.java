package com.example.addressbook.repository;

import com.example.addressbook.model.entity.Contact;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findByFirstNameContainingIgnoreCase(String firstName, Pageable pageable);
    List<Contact> findByLastNameContainingIgnoreCase(String lastName, Pageable pageable);
    List<Contact> findByCategory(String category, Pageable pageable);
    List<Contact> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCategory(String firstName, String lastName, String category, Pageable pageable);

    @Query("SELECT c FROM Contact c WHERE LOWER(c.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.category) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Contact> searchBy(@Param("search") String search, Pageable pageable);

    @Query("SELECT c FROM Contact c WHERE LOWER(c.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.category) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Contact> searchBy(@Param("search") String search);

    List<Contact> findByCategory(String category);
}
