package com.tienda.backend;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class Rest {
    private final ProductoRepository repo;

    public Rest(ProductoRepository repo) 
    {  
        this.repo = repo;
    }

    @GetMapping
    public List<ProductoDTO> listar()
    {
        return repo.findAll().stream()
                   .map(ProductoDTO::new)
                   .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> obtenerPorId(@PathVariable Long id)
    {
        return repo.findById(id)
                   .map(producto -> ResponseEntity.ok(new ProductoDTO(producto)))
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Producto crear(@RequestBody Producto p)
    {
        return repo.save(p);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProductoDTO> crearConDTO(@RequestBody ProductoDTO productoDTO)
    {
        Producto producto = new Producto();
        producto.setNombre(productoDTO.getNombre());
        producto.setPrecio(productoDTO.getPrecio());
        producto.setDescripcion(productoDTO.getDescripcion());
        producto.setStock(productoDTO.getStock());

        Producto savedProducto = repo.save(producto);
        return ResponseEntity.ok(new ProductoDTO(savedProducto));
    }

    @GetMapping("/stock-bajo")
    public List<ProductoDTO> obtenerProductosStockBajo()
    {
        return repo.findAll().stream()
                   .filter(producto -> producto.getStock() != null && producto.getStock() < 10)
                   .map(ProductoDTO::new)
                   .collect(Collectors.toList());
    }

    @GetMapping("/en-stock")
    public List<ProductoDTO> obtenerProductosEnStock()
    {
        return repo.findAll().stream()
                   .filter(producto -> producto.getStock() != null && producto.getStock() > 0)
                   .map(ProductoDTO::new)
                   .collect(Collectors.toList());
    }
}
