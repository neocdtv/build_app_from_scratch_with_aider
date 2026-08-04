package com.example.addressbook;

import com.example.addressbook.model.entity.Contact;
import com.example.addressbook.repository.ContactRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb",
        "spring.datasource.driverClassName=org.h2.Driver",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect"
})
class ContactRepositoryTest {

    @Autowired
    private ContactRepository contactRepository;

    @BeforeEach
    void setUp() {
        contactRepository.deleteAll();
    }

    @Test
    void testSaveAndFindById() {
        Contact contact = new Contact("John", "Doe", "john@email.com", "+14155551234", "123 Main St", "Family");
        contact = contactRepository.save(contact);
        assertNotNull(contact.getId());
        Contact found = contactRepository.findById(contact.getId()).orElse(null);
        assertNotNull(found);
        assertEquals("John", found.getFirstName());
    }

    @Test
    void testFindByFirstNameContainingIgnoreCase() {
        Contact contact1 = new Contact("John", "Doe", "john@email.com", "+14155551234", "123 Main St", "Family");
        Contact contact2 = new Contact("Johnny", "Smith", "johnny@email.com", "+14155555678", "456 Oak Ave", "Work");
        contactRepository.save(contact1);
        contactRepository.save(contact2);
        List<Contact> results = contactRepository.findByFirstNameContainingIgnoreCase("ohn", null);
        assertEquals(2, results.size());
    }

    @Test
    void testSearchBy() {
        Contact contact1 = new Contact("John", "Doe", "john@email.com", "+14155551234", "123 Main St", "Family");
        Contact contact2 = new Contact("Jane", "Smith", "jane@email.com", "+14155555678", "456 Oak Ave", "Work");
        contactRepository.save(contact1);
        contactRepository.save(contact2);
        List<Contact> results = contactRepository.searchBy("ohn", null);
        assertEquals(1, results.size());
        assertEquals("John", results.get(0).getFirstName());
    }

    @Test
    void testSearchByWithCategory() {
        Contact contact1 = new Contact("John", "Doe", "john@email.com", "+14155551234", "123 Main St", "Family");
        Contact contact2 = new Contact("Jane", "Smith", "jane@email.com", "+14155555678", "456 Oak Ave", "Work");
        contactRepository.save(contact1);
        contactRepository.save(contact2);
        List<Contact> results = contactRepository.searchBy("ohn", null);
        assertEquals(1, results.size());
        assertEquals("Family", results.get(0).getCategory());
    }

    @Test
    void testFindByCategory() {
        Contact contact1 = new Contact("John", "Doe", "john@email.com", "+14155551234", "123 Main St", "Family");
        Contact contact2 = new Contact("Jane", "Smith", "jane@email.com", "+14155555678", "456 Oak Ave", "Work");
        contactRepository.save(contact1);
        contactRepository.save(contact2);
        List<Contact> results = contactRepository.findByCategory("Family", null);
        assertEquals(1, results.size());
        assertEquals("John", results.get(0).getFirstName());
    }
}
