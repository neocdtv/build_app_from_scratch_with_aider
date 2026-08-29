package com.addressbook.config;

import com.addressbook.model.Contact;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @PostConstruct
    public void init() {
        // Contacts will be inserted by the CommandLineRunner
    }

    @Override
    public void run(String... args) {
        // Insert 5 sample contacts into the H2 database on startup
        contactRepository.saveAll(sampleContacts);
    }
}
