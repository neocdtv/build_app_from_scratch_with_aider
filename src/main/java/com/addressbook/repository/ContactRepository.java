package com.addressbook.repository;

import com.addressbook.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    @Query("SELECT c FROM Contact c WHERE LOWER(c.firstName) LIKE :query OR LOWER(c.lastName) LIKE :query OR LOWER(c.category) LIKE :query")
    List<Contact> searchByQuery(@Param("query") String query);
}
