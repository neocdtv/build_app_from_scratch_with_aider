package com.addressbook.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;

@Component
public class DatabaseInitializer implements ApplicationListener<ContextRefreshedEvent> {

    private final ResourceDatabasePopulator databasePopulator;

    @Autowired
    public DatabaseInitializer() {
        this.databasePopulator = new ResourceDatabasePopulator();
        this.databasePopulator.addScript(
            new ClassPathResource("data.sql")
        );
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (event.getApplicationContext().getEnvironment().getProperty("spring.datasource.url") != null) {
            try {
                databasePopulator.execute();
            } catch (IOException e) {
                throw new RuntimeException("Failed to initialize database", e);
            }
        }
    }
}
