package com.addressbook.repository;

import com.addressbook.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    
    List<Contact> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(
            String firstName, String lastName, String category);
    
    List<Contact> findByFirstNameContainingIgnoreCase(String firstName);
    
    List<Contact> findByLastNameContainingIgnoreCase(String lastName);
    
    List<Contact> findByCategoryContainingIgnoreCase(String category);
}
