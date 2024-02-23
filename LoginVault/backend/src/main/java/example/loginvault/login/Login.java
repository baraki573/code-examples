package example.loginvault.login;

import de.detim.eap.loginvault.category.Category;
import example.loginvault.common.base.LoginVaultEntity;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true, exclude = {"category", "hashtags"})
public class Login extends LoginVaultEntity {

    @Column(unique = true, nullable = false)
    private String url;

    private String name;

    private String description;

    private String username;

    private String password;

    @ManyToOne
    private Category category;

    @ElementCollection(targetClass = String.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "hashtags")
    @Column(name = "hashtag", nullable = false)
    private List<String> hashtags = new ArrayList<>();

}
