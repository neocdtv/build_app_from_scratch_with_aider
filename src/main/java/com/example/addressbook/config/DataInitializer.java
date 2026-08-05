package com.example.addressbook.config;

import com.example.addressbook.model.entity.Contact;
import com.example.addressbook.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final ContactRepository contactRepository;

    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            contactRepository.save(Contact.builder().firstName("John").lastName("Doe").email("john.doe@example.com").phoneNumber("+1234567890").category("Family").build());
            contactRepository.save(Contact.builder().firstName("Jane").lastName("Smith").email("jane.smith@example.com").phoneNumber("+1987654321").category("Work").build());
            contactRepository.save(Contact.builder().firstName("Alice").lastName("Johnson").email("alice.j@example.com").phoneNumber("+1555666777").category("Friends").build());
            contactRepository.save(Contact.builder().firstName("Bob").lastName("Brown").email("bob.b@example.com").phoneNumber("+1112223334").category("Work").build());
            contactRepository.save(Contact.builder().firstName("Charlie").lastName("Davis").email("charlie.d@example.com").phoneNumber("+1444555666").category("Client").build());
        };
    }
}
