package com.workspace.server.rest;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    private volatile boolean ready = false;

    @RequestMapping(path = {"/_ah/start", "/_ah/health"}, method = {
            RequestMethod.GET, RequestMethod.POST, RequestMethod.HEAD, RequestMethod.PUT, RequestMethod.OPTIONS
    })
    public ResponseEntity<Void> start() {
        return ResponseEntity.ok().build();
    }
    @RequestMapping(path = "/health", method = {
            RequestMethod.GET, RequestMethod.POST, RequestMethod.HEAD, RequestMethod.PUT, RequestMethod.OPTIONS
    })
    public ResponseEntity<Void> health() {
        return ResponseEntity.ok().build();
    }

    @RequestMapping(path = "/ready", method = {
            RequestMethod.GET, RequestMethod.POST, RequestMethod.HEAD, RequestMethod.PUT, RequestMethod.OPTIONS
    })
    public ResponseEntity<Void> ready() {
        if (ready) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
    }

    @EventListener(ApplicationReadyEvent.class)
    public void setReady() {
        ready = true;
    }
}
