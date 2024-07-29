package com.web.invoice.primarydb.service;

import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import java.util.Set;

@Service
public final class ValidationHelper {
    private final Validator validator;

    public ValidationHelper(Validator validator) {
        this.validator = validator;
    }

    public <T> void validate(T dto) {
        Set<ConstraintViolation<T>> errors = validator.validate(dto);
        if (!errors.isEmpty()) {
            System.out.println("Validation errors detected:");
            errors.forEach(error -> System.out.println(error.getPropertyPath() + " " + error.getMessage() + " " + error.getInvalidValue()));
            throw new IllegalArgumentException("Validation failed");
        }
    }
}
