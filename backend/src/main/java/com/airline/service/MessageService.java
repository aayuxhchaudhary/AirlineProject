package com.airline.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.text.MessageFormat;

@Service
public class MessageService {

    private final Environment env;

    @Autowired
    public MessageService(Environment env) {
        this.env = env;
    }

    public String get(String key, Object... args) {
        String msg = env.getProperty(key, key);
        if (args != null && args.length > 0) {
            try {
                Object[] strArgs = new Object[args.length];
                for (int i = 0; i < args.length; i++) {
                    strArgs[i] = args[i] != null ? args[i].toString() : "null";
                }
                return MessageFormat.format(msg, strArgs);
            } catch (Exception e) {
                return msg;
            }
        }
        return msg;
    }
}
