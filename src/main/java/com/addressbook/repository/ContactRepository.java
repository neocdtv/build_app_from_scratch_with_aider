package com.addressbook.repository;

import com.addressbook.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    @Query("SELECT c FROM Contact c WHERE c.firstName LIKE %?1% OR c.lastName LIKE %?1%")
    List<Contact> findByFirstNameOrLastNameContainingIgnoreCase(String keyword);

    @Query("SELECT c FROM Contact c WHERE c.category = ?1")
    List<Contact> findByCategory(String category);
}
