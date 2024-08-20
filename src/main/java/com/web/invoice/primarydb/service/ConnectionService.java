package com.web.invoice.primarydb.service;

import com.web.invoice.primarydb.model.ConnectionData;
import com.web.invoice.primarydb.model.UserPos;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;

@Service
public class ConnectionService {
    private final HttpServletRequest request;

    public ConnectionService(HttpServletRequest request) {
        this.request = request;
    }

    public ConnectionData getConnectionData() {
        ConnectionData connectionData = new ConnectionData();
        connectionData.setCodeUser(getCodeUser());
        connectionData.setIpSource(request.getRemoteHost());
        return connectionData;
    }

    private String getCodeUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return String.valueOf(((UserPos) auth.getPrincipal()).getCodeUser());
    }
}
