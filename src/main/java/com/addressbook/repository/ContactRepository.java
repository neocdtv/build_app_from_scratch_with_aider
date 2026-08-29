package com.addressbook.repository;

import com.addressbook.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    @Query("SELECT c FROM Contact c WHERE " +
           "c.firstName LIKE :keyword OR " +
           "c.lastName LIKE :keyword OR " +
           "c.category LIKE :keyword")
    List<Contact> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(@Param("keyword") String keyword);

    List<Contact> findByFirstNameContainingIgnoreCase(String keyword);
    List<Contact> findByLastNameContainingIgnoreCase(String keyword);
    List<Contact> findByCategoryContainingIgnoreCase(String keyword);
}
