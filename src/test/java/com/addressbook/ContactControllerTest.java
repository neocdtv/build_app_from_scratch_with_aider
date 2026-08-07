package com.addressbook;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testGetAllContacts() throws Exception {
        mockMvc.perform(get("/api/contacts"))
                .andExpect(status().isOk())
                // Verify that the 5 sample contacts from DataInitializer are present
                .andExpect(jsonPath("$", hasSize(5)));
    }

    @Test
    public void testSearchContacts() throws Exception {
        mockMvc.perform(get("/api/contacts/search").param("q", "John"))
                .andExpect(status().isOk())
                // John Doe is one of the seeded contacts
                .andExpect(jsonPath("$", hasItem(org.hamcrest.Matchers.any())));
    }
}
