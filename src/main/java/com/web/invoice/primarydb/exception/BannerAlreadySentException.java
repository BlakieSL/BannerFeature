package com.web.invoice.primarydb.exception;

public class BannerAlreadySentException extends RuntimeException{
    public BannerAlreadySentException(String message) {
        super(message);
    }
}
