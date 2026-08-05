package com.example.addressbook.repository;

import com.example.addressbook.model.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(
            @Param("firstName") String firstName,
            @Param("lastName") String lastName,
            @Param("category") String category);
    
    List<Contact> findByCategory(@Param("category") String category);
}
