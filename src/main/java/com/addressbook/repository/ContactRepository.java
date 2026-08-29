package com.addressbook.repository;

import com.addressbook.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    @Query(value = "SELECT c FROM Contact c WHERE " +
        "c.firstName LIKE :firstName OR " +
        "c.lastName LIKE :lastName OR " +
        "c.category LIKE :category",
    nativeQuery = false)
    List<Contact> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(
        @Param("firstName") String firstName,
        @Param("lastName") String lastName,
        @Param("category") String category
    );

    Optional<Contact> findByEmail(String email);
}
