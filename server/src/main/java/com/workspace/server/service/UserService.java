/*
package com.workspace.server.service;

import com.workspace.server.dto.UserData;
import com.workspace.server.dto.UserDetailsImpl;
import com.workspace.server.repository.User;
import com.workspace.server.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UserData getUserData(Long id) {
        User user = userRepository.getOne(id);
        return new UserData(
                user.getName(),
                user.getEmail(),
                user.getPhone()
        );
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException(username);
        }
        return new UserDetailsImpl(user);
    }
}*/
