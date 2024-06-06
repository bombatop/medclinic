package courseproject.springbootbackend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import courseproject.springbootbackend.model.entity.RoleEntity;
import courseproject.springbootbackend.service.RoleService;
import courseproject.springbootbackend.utility.PathsUtils;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = PathsUtils.ROLES_PATH)
@RequiredArgsConstructor
public class RoleController {

    private final RoleService service;

    @GetMapping
    public Page<RoleEntity> getRoles(
            @RequestParam(required = false) String searchQuery,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortField,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder), sortField);
        Pageable pageable = PageRequest.of(page, size, sort);
        return service.getRoles(searchQuery, pageable);
    }

    @GetMapping("{id}")
    public RoleEntity getRoleById(@PathVariable Integer id) {
        return service.getRoleById(id);
    }
}