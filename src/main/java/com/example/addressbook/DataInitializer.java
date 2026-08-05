package com.example.addressbook;

import com.example.addressbook.model.entity.Contact;
import com.example.addressbook.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ContactRepository contactRepository;

    @Override
    public void run(String... args) {
        if (contactRepository.count() == 0) {
            contactRepository.save(Contact.builder()
                    .firstName("Alice")
                    .lastName("Johnson")
                    .email("alice.johnson@example.com")
                    .phoneNumber("+14155551234")
                    .address("123 Main St, San Francisco, CA")
                    .category("Friend")
                    .build());
            contactRepository.save(Contact.builder()
                    .firstName("Bob")
                    .lastName("Smith")
                    .email("bob.smith@example.com")
                    .phoneNumber("+16505556789")
                    .address("456 Oak Ave, San Jose, CA")
                    .category("Colleague")
                    .build());
            contactRepository.save(Contact.builder()
                    .firstName("Carol")
                    .lastName("Williams")
                    .email("carol.williams@example.com")
                    .phoneNumber("+14085552345")
                    .address("789 Pine Rd, Cupertino, CA")
                    .category("Family")
                    .build());
            contactRepository.save(Contact.builder()
                    .firstName("David")
                    .lastName("Brown")
                    .email("david.brown@example.com")
                    .phoneNumber("+15105553456")
                    .address("101 Maple Ln, Berkeley, CA")
                    .category("Classmate")
                    .build());
            contactRepository.save(Contact.builder()
                    .firstName("Eve")
                    .lastName("Davis")
                    .email("eve.davis@example.com")
                    .phoneNumber("+16285554567")
                    .address("202 Cedar Blvd, Palo Alto, CA")
                    .category("Neighbor")
                    .build());
        }
    }
}
