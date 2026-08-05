package com.example.addressbook.repository;

import com.example.addressbook.model.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    @Query("SELECT c FROM Contact c WHERE " +
           "(:category IS NULL OR LOWER(c.category) = LOWER(:category)) AND " +
           "(:search IS NULL OR LOWER(c.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.category) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Contact> searchContacts(@Param("category") String category, @Param("search") String search);
}
