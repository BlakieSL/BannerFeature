package com.web.invoice;

import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class InvoiceApplication {

	public static void main(String[] args) {
//		SpringApplication.run(InvoiceApplication.class, args);
		SpringApplicationBuilder builder = new SpringApplicationBuilder(InvoiceApplication.class);
		builder.headless(false);
		ConfigurableApplicationContext context = builder.run(args);
	}

}
