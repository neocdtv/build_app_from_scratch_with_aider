package com.addressbook.repository;

import com.addressbook.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    @Query("SELECT c FROM Contact c WHERE " +
           "(c.firstName LIKE %:search% OR " +
           "c.lastName LIKE %:search% OR " +
           "c.category LIKE %:search%)")
    List<Contact> searchByNameOrCategory(@Param("search") String search);

    @Query("SELECT c FROM Contact c WHERE c.firstName LIKE %:search%")
    List<Contact> searchByFirstName(@Param("search") String search);

    @Query("SELECT c FROM Contact c WHERE c.lastName LIKE %:search%")
    List<Contact> searchByLastName(@Param("search") String search);

    @Query("SELECT c FROM Contact c WHERE c.category LIKE %:search%")
    List<Contact> searchByCategory(@Param("search") String search);
}
