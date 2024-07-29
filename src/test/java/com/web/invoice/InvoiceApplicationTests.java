package com.web.invoice;

import com.web.invoice.primarydb.controller.LoyalController;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.ArrayList;
import java.util.List;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
class InvoiceApplicationTests {
    @InjectMocks
    private LoyalController controller;


/*	@BeforeTestClass
	public static void setupHeadlessMode() {
		System.setProperty("java.awt.headless", "false");
	}

	@Test
	void contextLoads() {
	}*/

}
