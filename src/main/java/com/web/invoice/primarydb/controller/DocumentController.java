package com.web.invoice.primarydb;

import com.web.invoice.primarydb.model.*;
import com.web.invoice.primarydb.service.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.repository.query.Param;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api")
@Slf4j
public class DocumentController {

    @Autowired
    UserService userService;
    private final HttpServletRequest request;

    public DocumentController(HttpServletRequest request) {
        this.request = request;
    }

    @RequestMapping("test")
    public String testConnenction(){
        return "Succefull connected";
    }

    private Date getCurrentDate(){
        SimpleDateFormat sdf = new SimpleDateFormat("dd.MM.yyyy");
        try{
            return sdf.parse(sdf.format(new Date()));
        } catch (Exception ex) {
            return new Date();
        }
    }

    private ConnectionData getConnectionData() {
        ConnectionData connectionData = new ConnectionData();
        connectionData.setCodeUser(getCodeUser());
        connectionData.setIpSource(request.getRemoteHost());
        return connectionData;
    }

    @RequestMapping("code-user")
    public String getCodeUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String codeUser = String.valueOf(((UserPos)auth.getPrincipal()).getCodeUser());
        return codeUser;
    }

}

