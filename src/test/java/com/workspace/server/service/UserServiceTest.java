package com.workspace.server.service;

import com.workspace.server.dto.ProfileEditRequest;
import com.workspace.server.model.User;
import com.workspace.server.repository.UserRepository;
import com.workspace.server.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Mock
    private ProfileEditRequest request;

    private final LocalTime startAtTime = LocalTime.of(9, 0);
    private final LocalTime endAtTime = LocalTime.of(18, 0);
    private final LocalDate birthday = LocalDate.of(2000, 9, 13);
    private final LocalTime updatedStartAtTime = LocalTime.of(10, 0);
    private final LocalTime updatedEndAtTime = LocalTime.of(19, 0);

    @Captor
    private ArgumentCaptor<User> userCaptor;

    @BeforeEach
    void setUp() {
        when(request.getEmail()).thenReturn("updatedEmail");
        when(request.getPhone()).thenReturn("updatedPhoneNumber");
        when(request.getTg()).thenReturn("updatedTelegram");
        when(request.getAbout()).thenReturn("updated info");
        when(request.getStartAt()).thenReturn(updatedStartAtTime);
        when(request.getEndAt()).thenReturn(updatedEndAtTime);
        when(request.getStatus()).thenReturn('2');
    }

    @Test
    void shouldUpdateMainInfoWhenUsernameIsCurrentUser() {
        // given
        String username = "username";
        UserPrincipal currentUser = mock(UserPrincipal.class);
        when(currentUser.getUsername()).thenReturn(username);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(createUser()));

        // when
        userService.editProfile(currentUser, username, request);

        // then
        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getEmail()).isEqualTo("updatedEmail");
        assertThat(savedUser.getPhone()).isEqualTo("updatedPhoneNumber");
        assertThat(savedUser.getTg()).isEqualTo("updatedTelegram");
        assertThat(savedUser.getAbout()).isEqualTo("updated info");
        assertThat(savedUser.getStartAt()).isEqualTo(updatedStartAtTime);
        assertThat(savedUser.getEndAt()).isEqualTo(updatedEndAtTime);
        assertThat(savedUser.getStatus()).isEqualTo('2');
        assertThat(savedUser.getBirthday()).isEqualTo(birthday);
        assertThat(savedUser.getSecretNote()).isEqualTo("secret value");
        assertThat(savedUser.getPosition()).isEqualTo("position");
    }

    private User createUser() {
        User user = new User();
        user.setEmail("email");
        user.setPhone("phoneNumber");
        user.setTg("telegram");
        user.setAbout("info");
        user.setStartAt(startAtTime);
        user.setEndAt(endAtTime);
        user.setStatus('1');
        user.setBirthday(birthday);
        user.setSecretNote("secret value");
        user.setPosition("position");
        return user;
    }
}