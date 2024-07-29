package com.web.invoice.primarydb.controller;

import com.web.invoice.primarydb.model.*;
import com.web.invoice.primarydb.service.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;
import com.web.invoice.primarydb.version.Version;

@Slf4j
@RestController
@RequestMapping("api-loyal")
public class LoyalController {

    private UserService userService;
    private final HttpServletRequest request;

    public LoyalController(HttpServletRequest request) {
        this.request = request;
    }
    @Autowired
    private void setUserService(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("test")
    public String testConnection() throws Exception{
        if (true ) throw new Exception("test exception");
        return "Successful connect";
    }
    private Date getCurrentDate(){
        SimpleDateFormat sdf = new SimpleDateFormat("dd.MM.yyyy");
        try{
            return sdf.parse(sdf.format(new Date()));
        } catch (Exception ex) {
            return new Date();
        }
    }

    @ExceptionHandler({ Exception.class })
    public ResponseEntity<Object> handleAll(Exception ex, WebRequest request) {
        String apiError = ex.getLocalizedMessage();
        log.error("unexpected error", ex);
        return new ResponseEntity<Object>(
                apiError, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    @RequestMapping("code-user")
    public String getCodeUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String codeUser = String.valueOf(((UserPos)auth.getPrincipal()).getCodeUser());
        return codeUser;
    }

    public String getNameUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String codeUser = String.valueOf(((UserPos)auth.getPrincipal()).getUsername());
        return codeUser;
    }

    public UserPos getUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (UserPos)auth.getPrincipal();
    }

    public String getCodeProfileUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String codeProfile = String.valueOf(((UserPos)auth.getPrincipal()).getCodeProfile());
        return codeProfile;
    }

    @RequestMapping("basic-auth")
    public Config getAuthUser(@RequestParam("username") String username) {
        Config config = new Config();
        UserPos userPos = (UserPos) userService.loadUserByUsername(username);
        config.setUserPos(userPos);
        config.setCodeShop(-1);
        config.setIdWorkplace(-1);
        config.setVersion(new Version().getVersion());
        config.setAccessEventList(userService.getAccessCodeEventList(userPos.getCodeProfile()));
        return config;
    }

    private ConnectionData getConnectionData() {
        ConnectionData connectionData = new ConnectionData();
        connectionData.setCodeUser(getCodeUser());
        connectionData.setIpSource(request.getRemoteHost());
        return connectionData;
    }

}

