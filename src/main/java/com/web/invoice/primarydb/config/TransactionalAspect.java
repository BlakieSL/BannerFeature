package com.web.invoice.primarydb.config;

import com.web.invoice.primarydb.model.ConnectionData;
import com.web.invoice.primarydb.model.UserPos;
import com.web.invoice.primarydb.service.ConfigService;
import com.web.invoice.primarydb.service.ConnectionService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

@Aspect
@Component
public class TransactionalAspect {
/*
    private final ConfigService configService;
    private final ConnectionService connectionService;

    @Autowired
    public TransactionalAspect(ConfigService configService, ConnectionService connectionService) {
        this.configService = configService;
        this.connectionService = connectionService;
    }

    @Before("@annotation(javax.transaction.Transactional)")
    public void setConfigForTransactionalMethods() {
        ConnectionData connectionData = connectionService.getConnectionData();
        if (connectionData != null) {
            configService.setConfig(connectionData.getCodeUser(), connectionData.getIpSource());
        }
    }

 */
}