package com.addressbook.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.addressbook.model.Contact;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    
    /**
     * Custom query method to search by first name, last name, or category (case-insensitive)
     */
    java.util.List<Contact> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(
            String firstName, 
            String lastName, 
            String category);
}
