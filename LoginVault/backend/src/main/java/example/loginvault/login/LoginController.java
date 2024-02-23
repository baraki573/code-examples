package example.loginvault.login;

import example.loginvault.common.base.CrudController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${API_BASE}/logins")
@RequiredArgsConstructor
public class LoginController implements CrudController<Login> {

    private final LoginService service;

    @Override
    @PostMapping
    public Login create(@RequestBody Login login) {
        return service.create(login);
    }

    @Override
    @GetMapping(params = {"!categoryName", "!orderBy"})
    public List<Login> findAll() {
        return service.findAll();
    }

    @GetMapping(params = {"!categoryName", "orderBy"})
    public List<Login> findAll(@RequestParam String orderBy) {
        return service.findAll(orderBy);
    }

    @GetMapping(params = {"categoryName", "!orderBy"})
    public List<Login> findAllByCategoryName(@RequestParam String categoryName) {
        return service.findAllByCategoryName(categoryName);
    }

    @GetMapping(params = {"categoryName", "orderBy"})
    public List<Login> findAllByCategoryName(@RequestParam String categoryName, @RequestParam String orderBy) {
        return service.findAllByCategoryName(categoryName, orderBy);
    }

    @Override
    @GetMapping("/{id}")
    public Login getById(@PathVariable("id") Long id) {
        return service.getById(id);
    }

    @Override
    @PutMapping("/{id}")
    public Login update(@PathVariable("id") Long id, @RequestBody Login login) {
        return service.update(id, login);
    }

    @Override
    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id) {
        service.deleteById(id);
    }

}
