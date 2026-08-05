package com.example.addressbook.repository;

import com.example.addressbook.model.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
}
package com.example.addressbook.repository;

import com.example.addressbook.model.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(String firstName, String lastName, String category);
    
    default List<Contact> findAllBySearchPattern(String pattern) {
        String searchPattern = "%" + pattern + "%";
        return findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(searchPattern, searchPattern, searchPattern);
    }
    
    List<Contact> findByCategory(String category);
}
