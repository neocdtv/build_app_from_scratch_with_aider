package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ContactRepository contactRepository;

    @Override
    public void run(String... args) throws Exception {
        if (contactRepository.count() == 0) {
            Contact c1 = new Contact();
            c1.setFirstName("John"); c1.setLastName("Doe"); c1.setEmail("john.doe@example.com");
            c1.setPhoneNumber("+1-555-1234"); c1.setAddress("123 Main Street, Anytown, USA");
            c1.setCategory("Family");
            contactRepository.save(c1);

            Contact c2 = new Contact();
            c2.setFirstName("Jane"); c2.setLastName("Smith"); c2.setEmail("jane.smith@company.org");
            c2.setPhoneNumber("+1-555-9876"); c2.setAddress("456 Business Park Blvd, Tech City, USA");
            c2.setCategory("Work");
            contactRepository.save(c2);

            Contact c3 = new Contact();
            c3.setFirstName("Robert"); c3.setLastName("Johnson"); c3.setEmail("rob.johnson@mail.com");
            c3.setPhoneNumber("+1-555-5555"); c3.setAddress("789 Pine Road, Suburbia, USA");
            c3.setCategory("Friends");
            contactRepository.save(c3);

            Contact c4 = new Contact();
            c4.setFirstName("Emily"); c4.setLastName("Davis"); c4.setEmail("emily.davis@design.net");
            c4.setPhoneNumber("+1-555-4321"); c4.setAddress("321 Creative Ave, Artville, USA");
            c4.setCategory("Work");
            contactRepository.save(c4);

            Contact c5 = new Contact();
            c5.setFirstName("Michael"); c5.setLastName("Brown"); c5.setEmail("mike.brown@home.com");
            c5.setPhoneNumber("+1-555-7890"); c5.setAddress("654 Oak Lane, HomeTown, USA");
            c5.setCategory("Family");
            contactRepository.save(c5);
        }
    }
}
