package com.addressbook.repository;

import com.addressbook.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    @Query("SELECT c FROM Contact c WHERE c.firstName LIKE :firstName OR c.lastName LIKE :lastName OR c.category LIKE :category")
    List<Contact> searchByNameOrCategory(@Param("firstName") String firstName, 
                                         @Param("lastName") String lastName, 
                                         @Param("category") String category);

    @Query("SELECT c FROM Contact c WHERE c.firstName LIKE %:firstName% OR c.lastName LIKE %:lastName% OR c.category LIKE %:category%")
    List<Contact> searchByNameOrCategoryIgnoreCase(@Param("firstName") String firstName, 
                                                  @Param("lastName") String lastName, 
                                                  @Param("category") String category);
}
