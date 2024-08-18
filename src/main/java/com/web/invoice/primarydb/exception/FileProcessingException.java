package com.web.invoice.primarydb.exception;

public class FileProcessingException extends RuntimeException {
    public FileProcessingException(String message, Throwable cause) {
        super(message, cause);
    }
}