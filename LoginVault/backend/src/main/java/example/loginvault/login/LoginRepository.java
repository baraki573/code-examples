package example.loginvault.login;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoginRepository extends JpaRepository<Login, Long> {

    Optional<Login> findByUrl(String url);

    List<Login> findAllByCategoryName(String catName);

    List<Login> findAllByCategoryName(String catName, Sort sort);

}
