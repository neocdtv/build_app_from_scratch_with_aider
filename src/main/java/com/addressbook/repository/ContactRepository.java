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
    List<Contact> searchByNameOrCategory(@Param("firstName") String firstName, 
                                          @Param("lastName") String lastName, 
                                          @Param("category") String category);
    
    @Query("SELECT c FROM Contact c WHERE c.firstName LIKE %:search%")
    List<Contact> findByFirstNameContainingIgnoreCase(@Param("search") String search);
    
    @Query("SELECT c FROM Contact c WHERE c.lastName LIKE %:search%")
    List<Contact> findByLastNameContainingIgnoreCase(@Param("search") String search);
    
    @Query("SELECT c FROM Contact c WHERE c.category LIKE %:search%")
    List<Contact> findByCategoryContainingIgnoreCase(@Param("search") String search);
}
