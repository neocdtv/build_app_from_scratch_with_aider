package com.addressbook.repository;

import com.addressbook.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    @Query("SELECT c FROM Contact c WHERE LOWER(c.firstName) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(c.category) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Contact> searchByQuery(@Param("q") String query);
}
