package com.example.addressbook.config;

import com.example.addressbook.model.dto.ContactCreateDto;
import com.example.addressbook.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ContactService contactService;

    @Override
    public void run(String... args) {
        seed(createDto("John", "Doe", "john.doe@example.com", "+1234567890", "123 Main St", "Family"));
        seed(createDto("Jane", "Smith", "jane.smith@test.com", "+1987654321", "456 Oak Ave", "Work"));
        seed(createDto("Alice", "Wonder", "alice@wonderland.com", "+1122334455", "789 Rabbit Hole", "Friend"));
        seed(createDto("Bob", "Builder", "bob@build.com", "+1556677889", "101 Construction Rd", "Work"));
        seed(createDto("Charlie", "Brown", "charlie@peanuts.com", "+1000000000", "202 Kite St", "Friend"));
    }

    private void seed(ContactCreateDto dto) {
        contactService.createContact(dto);
    }

    private ContactCreateDto createDto(String fn, String ln, String email, String ph, String addr, String cat) {
        ContactCreateDto dto = new ContactCreateDto();
        dto.setFirstName(fn);
        dto.setLastName(ln);
        dto.setEmail(email);
        dto.setPhoneNumber(ph);
        dto.setAddress(addr);
        dto.setCategory(cat);
        return dto;
    }
}
