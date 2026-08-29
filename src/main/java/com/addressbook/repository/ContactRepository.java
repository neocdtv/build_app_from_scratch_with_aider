package com.addressbook.repository;

import com.addressbook.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    @Query("SELECT c FROM Contact c WHERE c.firstName LIKE :firstName OR c.lastName LIKE :lastName OR c.category LIKE :category")
    List<Contact> searchByFirstNameOrLastNameOrCategory(@Param("firstName") String firstName,
                                                        @Param("lastName") String lastName,
                                                        @Param("category") String category);

    @Query("SELECT c FROM Contact c WHERE LOWER(c.firstName) LIKE LOWER(:firstName) OR LOWER(c.lastName) LIKE LOWER(:lastName) OR LOWER(c.category) LIKE LOWER(:category)")
    List<Contact> searchByFirstNameOrLastNameOrCategoryIgnoreCase(@Param("firstName") String firstName,
                                                                  @Param("lastName") String lastName,
                                                                  @Param("category") String category);
}
