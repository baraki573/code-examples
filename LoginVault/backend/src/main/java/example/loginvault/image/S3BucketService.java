package example.loginvault.image;


import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.util.Base64;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class S3BucketService {

    private final boolean useMock = true;

    private final S3Client s3 = useMock ? null : S3Client.create();

    @Value("${s3.bucketName}")
    private String bucketName;

    public List<String> getAllImageKeys() {
        if (useMock)
            return List.of("mock.png");

        ListObjectsRequest listObjects = ListObjectsRequest
                .builder()
                .bucket(bucketName)
                .build();

        ListObjectsResponse res = s3.listObjects(listObjects);

        return res.contents().stream()
                .sorted(Comparator.comparing(S3Object::lastModified))
                .map(S3Object::key)
                .toList();
    }

    public String getBase64Image(@NotNull String key) {
        if (useMock && key.contains("mock"))
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAA" +
                    "AAGUlEQVR4nGI5+kKCATdgwiM3gqUBAQAA//8ywwHcp/6fwQAAAABJRU5ErkJggg==";

        if (!checkKeyExists(key))
            throw new EntityNotFoundException("Image '%s' was not found".formatted(key));

        try {
            GetObjectRequest objectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            var responseStream = s3.getObject(objectRequest);
            String encodedData = Base64.getEncoder().encodeToString(responseStream.readAllBytes());
            String type = responseStream.response().contentType();

            return "data:%s;base64,%s".formatted(type, encodedData);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public String uploadImage(@NotNull MultipartFile image) {
        if (useMock)
            return "mock" + generateKey(image);

        String key = generateKey(image);

        if (checkKeyExists(key))
            throw new IllegalArgumentException("Image '%s' already exists".formatted(key));

        try {
            PutObjectRequest objectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3.putObject(objectRequest, RequestBody.fromBytes(image.getBytes()));
            log.info("Image '%s' was uploaded successfully".formatted(key));
            return key;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void deleteImage(@NotNull String key) {
        if (useMock) return;

        if (!checkKeyExists(key))
            throw new EntityNotFoundException("Image '%s' was not found".formatted(key));

        DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        s3.deleteObject(objectRequest);
        log.info("Image '%s' was deleted".formatted(key));
    }

    private String generateKey(@NotNull MultipartFile file) {
        String filename = file.getOriginalFilename();
        if (filename == null || file.isEmpty())
            throw new IllegalArgumentException("Uploaded file is empty or does not exist");

        return "%s.%s".formatted(UUID.randomUUID().toString(), getFileExtension(filename));
    }

    private String getFileExtension(@NotNull String filename) {
        String[] splitted = filename.split("\\.");
        return splitted[splitted.length - 1];
    }

    private boolean checkKeyExists(@NotNull String key) {
        if (useMock) return false;

        try {
            HeadObjectRequest headObjectRequest = HeadObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            s3.headObject(headObjectRequest);

            return true;
        } catch (S3Exception e) {
            return false;
        }
    }
}
