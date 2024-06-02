package courseproject.springbootbackend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import courseproject.springbootbackend.model.dto.UserData;
import courseproject.springbootbackend.model.entity.UserEntity;
import courseproject.springbootbackend.service.UserService;
import courseproject.springbootbackend.utility.PathsUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = PathsUtils.DOCTORS_PATH)
@RequiredArgsConstructor
public class UserController {
    
    private final UserService service;

    @GetMapping
    public Page<UserEntity> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String searchQuery,
            @RequestParam(required = false) String sortField,
            @RequestParam(required = false) String sortOrder) {
        if (sortField == null || sortField.isEmpty()) {
            sortField = "surname";
        }
        if (sortOrder == null || sortOrder.isEmpty()) {
            sortOrder = "asc";
        }
        Sort sort = Sort.by(Sort.Order.by(sortField).with(Sort.Direction.fromString(sortOrder)));
        Pageable pageable = PageRequest.of(page, size, sort);
        return service.getUsers(searchQuery, pageable);
    }

    @GetMapping("{id}")
    public UserEntity getUserById(@PathVariable Integer id) {
        return service.getUserById(id);
    }

    @PutMapping("{id}")
    public UserEntity updateUser(
            @PathVariable Integer id,
            @Valid @RequestBody UserData user) {
        return service.updateUser(id, user);
    }

    @PostMapping
    public UserEntity addUser(@Valid @RequestBody UserData user) {
        return service.addUser(user);
    }

    @DeleteMapping("{id}")
    public void deleteUser(@PathVariable Integer id) {
        service.deleteUser(id);
    }
}