package example.loginvault.login;

import example.loginvault.common.base.AbstractCrudService;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mapping.PropertyReferenceException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class LoginService extends AbstractCrudService<Login, LoginRepository> {

    public LoginService(LoginRepository loginRepository) {
        super(loginRepository);
    }

    @Override
    public Login create(@NotNull Login login) {
        Login created = super.create(login);
        log.info("Login with URL \"{}\" was created", created.getUrl());

        return created;
    }

    @Override
    public Login update(@NotNull Long id, @NotNull Login login) {
        Login updated = super.update(id, login);
        log.info("Login with ID \"{}\" was updated", updated.getId());

        return updated;
    }

    @Override
    public void delete(@NotNull Login login) {
        super.delete(login);
        log.info("Login with name \"{}\" was deleted", login.getName());
    }

    public void deleteById(@NotNull Long id) {
        repo.deleteById(id);
        log.info("Login with ID \"{}\" was deleted", id);
    }

    public List<Login> findAllByCategoryName(@NotNull String categoryName) {
        return repo.findAllByCategoryName(categoryName);
    }

    public List<Login> findAllByCategoryName(@NotNull String categoryName, @NotNull String orderString) {
        try {
            return repo.findAllByCategoryName(categoryName, getSortFrom(orderString));
        } catch (PropertyReferenceException e) {
            throw new IllegalArgumentException(e.getMessage());
        }
    }

}
