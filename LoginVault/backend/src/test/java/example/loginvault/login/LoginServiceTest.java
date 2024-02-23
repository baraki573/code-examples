package example.loginvault.login;

import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static java.util.Collections.emptyList;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.assertj.core.api.BDDAssertions.then;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class LoginServiceTest {

    @Mock
    private LoginRepository loginRepoMock;

    @InjectMocks
    private LoginService service;

    @Test
    public void givenValidLogin_whenCreate_thenLoginShouldBeCreated() {
        Login loginNoId = Given.login(null);
        given(loginRepoMock.save(loginNoId)).willReturn(Given.login());

        Login created = service.create(loginNoId);

        verify(loginRepoMock).save(Given.login(null));
        then(created)
                .as("The returned login is not as expected")
                .isEqualTo(Given.login());
    }

    @Test
    public void givenPresentLoginForId_whenGetById_thenReturnLogin() {
        Login login = Given.login();
        Long id = login.getId();
        given(loginRepoMock.findById(id)).willReturn(Optional.of(login));

        Login retrieved = service.getById(id);

        verify(loginRepoMock).findById(id);
        then(retrieved)
                .as("The retrieved login is not as expected")
                .isEqualTo(Given.login());
    }

    @Test
    public void givenNoLoginForId_whenGetById_thenThrowException() {
        Long id = 42L;
        given(loginRepoMock.findById(id)).willReturn(Optional.empty());

        Throwable throwable = catchThrowable(() -> service.getById(id));

        verify(loginRepoMock).findById(id);
        then(throwable).as("An EntityNotFoundException should be thrown if no entity corresponding to the ID is present")
                .isInstanceOf(EntityNotFoundException.class)
                .as("A predefined message should be used")
                .hasMessage("No entity with requested ID found");
    }

    @Test
    public void givenLoginsPresent_whenFindAll_thenReturnThem() {
        given(loginRepoMock.findAll()).willReturn(Given.logins());

        List<Login> retrieved = service.findAll();

        verify(loginRepoMock).findAll();
        then(retrieved)
                .as("The retrieved logins or the amount of logins are not as expected")
                .isEqualTo(Given.logins());
    }

    @Test
    public void givenNoLoginsPresent_whenFindAll_thenReturnEmptyList() {
        given(loginRepoMock.findAll()).willReturn(new ArrayList<>());

        List<Login> retrieved = service.findAll();

        verify(loginRepoMock).findAll();
        then(retrieved)
                .as("If no logins are present an empty list should be returned")
                .isEmpty();
    }

    @Test
    public void givenIdsValid_whenUpdate_thenReturnLogin() {
        Long id = 5L;
        Login login = Given.login(id);
        given(loginRepoMock.save(login)).willReturn(login);

        Login updated = service.update(id, login);

        verify(loginRepoMock).save(login);
        then(updated)
                .as("The returned login is not as expected")
                .isEqualTo(Given.login(id));
    }

    @Test
    public void givenIdsNotValid_whenUpdate_thenThrowException() {
        Long id = 5L;
        Login login = Given.login(6L);

        Throwable throwable = catchThrowable(() -> service.update(id, login));

        then(throwable)
                .as("An IllegalArgumentException should be thrown if the IDs don't match")
                .isInstanceOf(IllegalArgumentException.class)
                .as("A predefined message format should be used")
                .hasMessage("Given %s doesn't contain the given ID".formatted(Login.class.getName()));
    }

    @Test
    public void givenLogin_whenDelete_thenNoException() {
        Login login = Given.login(6L);

        Throwable throwable = catchThrowable(() -> service.delete(login));

        verify(loginRepoMock).delete(Given.login(6L));
        then(throwable)
                .as("Deleting a login should not throw any Exception")
                .doesNotThrowAnyException();
    }

    @Test
    public void givenId_whenDeletedById_thenNoException() {
        Long id = 6L;

        Throwable throwable = catchThrowable(() -> service.deleteById(id));

        verify(loginRepoMock).deleteById(id);
        then(throwable)
                .as("Deleting a login by id should not throw any Exception")
                .doesNotThrowAnyException();
    }

    @Test
    public void givenLoginsForCategoryPresent_whenFindAllByCategoryName_thenReturnThem() {
        given(loginRepoMock.findAllByCategoryName("cat")).willReturn(Given.logins());

        List<Login> retrieved = service.findAllByCategoryName("cat");

        verify(loginRepoMock).findAllByCategoryName("cat");
        then(retrieved)
                .as("The retrieved logins or the amount of logins are not as expected")
                .isEqualTo(Given.logins());
    }

    @Test
    public void givenNoLoginsForCategoryPresent_whenFindAllByCategoryName_thenReturnEmptyList() {
        given(loginRepoMock.findAllByCategoryName("cat")).willReturn(emptyList());

        List<Login> retrieved = service.findAllByCategoryName("cat");

        verify(loginRepoMock).findAllByCategoryName("cat");
        then(retrieved)
                .as("If no logins are present for a category an empty list should be returned")
                .isEmpty();
    }

}
