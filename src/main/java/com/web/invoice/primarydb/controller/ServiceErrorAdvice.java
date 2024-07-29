package com.web.invoice.primarydb.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
@Slf4j
public class ServiceErrorAdvice extends ResponseEntityExceptionHandler {

/*    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler({Throwable.class})
    public void handle(final Throwable ex) {
        log.error("unexpected error", ex);
    }*/
@ExceptionHandler(Exception.class)
public ResponseEntity handleMyException(Exception ex, WebRequest request) {
    log.error("unexpected error", ex);
    //return handleExceptionInternal(ex,"argument error", new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    return new ResponseEntity(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
}



}