package com.web.invoice.primarydb.config;

import javax.servlet.http.HttpSessionEvent;
        import javax.servlet.http.HttpSessionListener;
        import org.springframework.beans.factory.annotation.Value;
        import org.springframework.context.annotation.Configuration;

@Configuration
public class SessionListener implements HttpSessionListener {

    @Value("${session.timeout}")
    private Integer sessionTimeout;

    @Override
    public void sessionCreated(HttpSessionEvent event) {
        event.getSession().setMaxInactiveInterval(sessionTimeout);
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent event) {}

}