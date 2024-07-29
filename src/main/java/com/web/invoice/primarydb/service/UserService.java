package com.web.invoice.primarydb.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.web.invoice.primarydb.dao.AccessEventRepository;
import com.web.invoice.primarydb.dao.UserPosViewRepository;
import com.web.invoice.primarydb.dao.UserRepository;
import com.web.invoice.primarydb.model.AccessEvent;
import com.web.invoice.primarydb.model.ConnectionData;
import com.web.invoice.primarydb.model.UserPos;
import com.web.invoice.primarydb.model.UserPosView;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserPosViewRepository userPosViewRepository;
    private final AccessEventRepository accessEventRepository;
    private static final Base64.Encoder b64encoder = Base64.getEncoder();

    public UserService(UserRepository userRepository, UserPosViewRepository userPosViewRepository, AccessEventRepository accessEventRepository) {
        this.userRepository = userRepository;
        this.userPosViewRepository = userPosViewRepository;
        this.accessEventRepository = accessEventRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        if (s.equals("logout")) return new UserPos(){{setUsername("logout"); setPassword("!@#$%^&*())");}};
        Optional<UserPos> user = userRepository.findByUsernameIgnoreCase(s);
        if (user.isPresent()) {
            user.get().setAccessEventList(getAccessEventList(user.get().getCodeProfile()));
            return user.get();
        } else{
            throw new UsernameNotFoundException(String.format("Username not found"));
        }
    }

    public int getAccess(String userName, int codeEvent){
        return userRepository.getAccess(userName, codeEvent);
    }

    public void setConfig(ConnectionData connectionData) {
        userRepository.setConfig(connectionData.getCodeUser(), connectionData.getIpSource());
    }

    public List<AccessEvent> getAccessEventList(int codeProfile){
        List<AccessEvent> list = accessEventRepository.getAccessEventList(codeProfile);
        list.forEach(ae -> {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                if (ae.getDetailAccessText() != null) {
                    LinkedHashMap<String, Object> map = objectMapper.readValue(ae.getDetailAccessText(), LinkedHashMap.class);
                    ae.setDetailAccess(map);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
        return list;
    }

    public List<Integer> getAccessCodeEventList(int codeProfile) {
        return accessEventRepository
                .getAccessEventList(codeProfile)
                .stream()
                .map(AccessEvent::getCodeEvent)
                .collect(Collectors.toList());
    }

    public List<UserPosView> getAllUSer() {
        return userPosViewRepository.getUserPosList(-2);
    }

    public int getNextCodeUser() {
        return userRepository.getNextCodeUser();
    }

    @Transactional
    public void save(UserPos userPos, ConnectionData connectionData) throws Exception {
        userRepository.setConfig(connectionData.getCodeUser(), connectionData.getIpSource());
        if (userPos.getOriginalCardNumber() == null || !userPos.getOriginalCardNumber().equals(userPos.getCardNumber())) {
            userPos.setCardNumber(getHash(userPos.getCardNumber()));
        }
        if (userPos.getOriginalPassword() == null || !userPos.getOriginalPassword().equals(userPos.getPassword())) {
            userPos.setPassword(getHash(userPos.getPassword()));
        }
        UserPos checkUser = userRepository.findByCardNumberAndCodeShop(userPos.getCardNumber(), userPos.getCodeShop()).orElse(null);
        if (checkUser != null && checkUser.getCodeUser() != userPos.getCodeUser()) throw new Exception("Номер карты уже существует");
        if (userPos.getCodeShop() == 0 || userPos.getCodeShop() == -1) {
            UserPos checkUser1 = userRepository.findByCardNumber(userPos.getCardNumber()).orElse(null);
            if (checkUser1 != null && checkUser1.getCodeUser() != userPos.getCodeUser()) throw new Exception("Номер карты уже существует");

            if (userPos.getUsername() != null) {
                UserPos checkUser2 = userRepository.findByUsername(userPos.getUsername()).orElse(null);
                if (checkUser2 != null && checkUser2.getCodeUser() != userPos.getCodeUser())
                    throw new Exception("Логин уже существует");
            }
        } else {
            checkUser = userRepository.findByCardNumberAndCodeShop(userPos.getCardNumber(), 0).orElse(null);
            if (checkUser != null && checkUser.getCodeUser() != userPos.getCodeUser()) throw new Exception("Номер карты уже существует");

            if (userPos.getUsername() != null) {
                UserPos checkUser2 = userRepository.findByUsernameAndCodeShop(userPos.getUsername(), 0).orElse(null);
                if (checkUser2 != null && checkUser2.getCodeUser() != userPos.getCodeUser())
                    throw new Exception("Логин уже существует");
            }
        }
        userRepository.save(userPos);
    }

    @Transactional
    public void delete(UserPos userPos, ConnectionData connectionData) {
        userRepository.setConfig(connectionData.getCodeUser(), connectionData.getIpSource());
        userRepository.delete(userPos);
    }

    @Transactional
    public void deleteById(int codeUser) {
        userRepository.deleteById(codeUser);
    }

    public static String getHash(String s) {
        try {
            MessageDigest digester = MessageDigest.getInstance("MD5");
            digester.update(s.getBytes(StandardCharsets.UTF_8));
            return b64encoder.encodeToString(digester.digest());
        } catch (NoSuchAlgorithmException var2) {
            return String.valueOf(s.hashCode());
        }
    }

}
