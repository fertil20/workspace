//package com.workspace.server.service;
//
//import com.workspace.server.security.UserPrincipal;
//import com.workspace.server.payload.UserSummary;
//import com.workspace.server.exception.ResourceNotFoundException;
//import com.workspace.server.model.User;
//import com.workspace.server.repository.UserRepository;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//import javax.transaction.Transactional;
//import java.util.Optional;
//
//@Service
//public class UserService implements UserDetailsService {
//
//    private final UserRepository userRepository;
//
//    public UserService(UserRepository userRepository) {
//        this.userRepository = userRepository;
//    }
//
//    @Transactional
//    public UserSummary getUserData(Long id) {
//        User user = userRepository.getOne(id);
//        return new UserSummary(
//                user.getId(),
//                user.getName(),
//                user.getEmail()
//                user.getPhone()
//
//        );
//    }
//
//    @Override
//    public UserDetails loadUserByUsername(String username) {
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
//        return new UserPrincipal(user);
//    }
//}
