package example.loginvault.login;

import de.detim.eap.loginvault.category.Category;
import example.loginvault.login.Login;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public abstract class Given {

    public static Category category() {
        Category category = new Category();
        category.setId(42L);
        category.setName("MyCategory");
        category.setCreatedOn(new Date(1699450973511L));
        return category;
    }

    public static Category category(Long id) {
        Category category = category();
        category.setId(id);
        return category;
    }

    public static Login login() {
        Login login = new Login();
        login.setId(42L);
        login.setUrl("https://www.google.de");
        login.setName("Google");
        login.setCategory(category());
        login.setDescription("Wonderful login");
        login.setUsername("Hans");
        login.setPassword("wurst");
        login.setHashtags(List.of("cool", "fav"));
        return login;
    }

    public static Login login(Long id) {
        Login login = login();
        login.setId(id);
        return login;
    }

    public static List<Login> logins() {
        return new ArrayList<>(List.of(login(1L), login(3L), login(25L), login(42L)));
    }

}
