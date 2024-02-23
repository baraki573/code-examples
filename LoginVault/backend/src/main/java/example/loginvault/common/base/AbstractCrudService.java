package example.loginvault.common.base;

import de.detim.eap.loginvault.common.validation.InputValidator;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mapping.PropertyReferenceException;

import java.util.List;

@RequiredArgsConstructor
public abstract class AbstractCrudService<T extends LoginVaultEntity, G extends JpaRepository<T, Long>> {

    protected final G repo;

    public T create(@NotNull T entity) {
        return repo.save(entity);
    }

    public T getById(@NotNull Long id) {
        String message = "No entity with requested ID found";
        return repo.findById(id).orElseThrow(() -> new EntityNotFoundException(message));
    }

    public List<T> findAll() {
        return repo.findAll();
    }

    public List<T> findAll(@NotNull String orderBy) {
        try {
            return repo.findAll(getSortFrom(orderBy));
        } catch (PropertyReferenceException e) {
            throw new IllegalArgumentException(e.getMessage());
        }
    }

    public T update(@NotNull Long id, @NotNull T entity) {
        InputValidator.validateID(id, entity);
        return repo.save(entity);
    }

    public void delete(@NotNull T entity) {
        repo.delete(entity);
    }

    protected Sort getSortFrom(@NotNull String orderString) {
        String[] parts = orderString.split(":");
        String order = parts.length >= 2 ? parts[1] : "ASC";

        Sort.Direction direction;
        switch (order.toUpperCase()) {
            case "ASC" -> direction = Sort.Direction.ASC;
            case "DESC" -> direction = Sort.Direction.DESC;
            default -> throw new IllegalArgumentException("Direction '%s' is not known".formatted(order));
        }
        return Sort.by(direction, parts[0].toLowerCase());
    }

}
