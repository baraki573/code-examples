package example.loginvault.image;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("${API_BASE}/image")
@RequiredArgsConstructor
public class S3BucketController {

    private final S3BucketService s3BucketService;

    @GetMapping
    public List<String> getAllImageKeys() {
        return this.s3BucketService.getAllImageKeys();
    }

    @GetMapping("{key}")
    public String getBase64Image(@PathVariable String key) {
        return this.s3BucketService.getBase64Image(key);
    }

    @PostMapping
    public String uploadImage(@RequestBody MultipartFile image) {
        return this.s3BucketService.uploadImage(image);
    }

    @DeleteMapping("{key}")
    public void deleteImage(@PathVariable String key) {
        this.s3BucketService.deleteImage(key);
    }
}
