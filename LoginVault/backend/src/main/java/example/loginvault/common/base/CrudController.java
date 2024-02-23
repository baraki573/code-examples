package example.loginvault.common.base;

import java.util.List;

public interface CrudController<T> {

    public T create(T entity);

    public List<T> findAll();

    public T getById(Long id);

    public T update(Long id, T entity);

    public void delete(Long id);

}
