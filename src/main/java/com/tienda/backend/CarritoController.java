package com.tienda.backend;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/carrito")
@CrossOrigin(origins = "*")
public class CarritoController {

    private final CarritoRepository carritoRepo;
    private final ProductoRepository productoRepo;

    public CarritoController(CarritoRepository carritoRepo, ProductoRepository productoRepo) {
        this.carritoRepo = carritoRepo;
        this.productoRepo = productoRepo;
    }

    @GetMapping
    public List<Carrito> obtenerCarrito() {
        return carritoRepo.findAll();
    }

    @PostMapping
    public ResponseEntity<Carrito> agregarAlCarrito(@RequestBody CarritoRequest request) {
        Optional<Producto> producto = productoRepo.findById(request.getProductoId());

        if (producto.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Verificar si el producto ya está en el carrito
        Optional<Carrito> carritoExistente = carritoRepo.findByProductoId(request.getProductoId());

        Carrito carrito;
        if (carritoExistente.isPresent()) {
            // Si ya existe, incrementar la cantidad
            carrito = carritoExistente.get();
            carrito.setCantidad(carrito.getCantidad() + request.getCantidad());
        } else {
            // Si no existe, crear nuevo registro
            carrito = new Carrito(producto.get(), request.getCantidad());
        }

        Carrito saved = carritoRepo.save(carrito);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Carrito> actualizarCantidad(@PathVariable Long id, @RequestBody ActualizarCantidadRequest request) {
        Optional<Carrito> carritoOpt = carritoRepo.findById(id);

        if (carritoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Carrito carrito = carritoOpt.get();

        // Si la nueva cantidad es 0 o negativa, eliminar el item
        if (request.getCantidad() <= 0) {
            carritoRepo.deleteById(id);
            return ResponseEntity.ok().build();
        }

        carrito.setCantidad(request.getCantidad());
        Carrito saved = carritoRepo.save(carrito);

        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDelCarrito(@PathVariable Long id) {
        if (carritoRepo.existsById(id)) {
            carritoRepo.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/finalizar")
    public ResponseEntity<Map<String, Object>> finalizarCompra() {
        Map<String, Object> response = new HashMap<>();

        try {
            // Obtener todos los items del carrito
            List<Carrito> carritoItems = carritoRepo.findAll();

            if (carritoItems.isEmpty()) {
                response.put("success", false);
                response.put("message", "El carrito está vacío");
                return ResponseEntity.badRequest().body(response);
            }

            // Verificar stock de todos los productos
            for (Carrito item : carritoItems) {
                Producto producto = item.getProducto();
                if (producto.getStock() == null || producto.getStock() < item.getCantidad()) {
                    response.put("success", false);
                    response.put("message", "Stock insuficiente para el producto: " + producto.getNombre());
                    response.put("productoError", producto.getNombre());
                    response.put("stockDisponible", producto.getStock());
                    response.put("cantidadSolicitada", item.getCantidad());
                    return ResponseEntity.badRequest().body(response);
                }
            }

            // Si llegamos aquí, hay stock suficiente para todos los productos
            double total = 0.0;
            for (Carrito item : carritoItems) {
                Producto producto = item.getProducto();

                // Actualizar stock del producto
                producto.setStock(producto.getStock() - item.getCantidad());
                productoRepo.save(producto);

                // Calcular total
                total += producto.getPrecio() * item.getCantidad();
            }

            // Vaciar el carrito después de la compra exitosa
            carritoRepo.deleteAll();

            response.put("success", true);
            response.put("message", "Compra realizada exitosamente");
            response.put("total", total);
            response.put("itemsComprados", carritoItems.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error interno del servidor: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Clase interna para el request
    public static class CarritoRequest {
        private Long productoId;
        private Integer cantidad;

        public Long getProductoId() {
            return productoId;
        }

        public void setProductoId(Long productoId) {
            this.productoId = productoId;
        }

        public Integer getCantidad() {
            return cantidad;
        }

        public void setCantidad(Integer cantidad) {
            this.cantidad = cantidad;
        }
    }

    public static class ActualizarCantidadRequest {
        private Integer cantidad;

        public Integer getCantidad() {
            return cantidad;
        }

        public void setCantidad(Integer cantidad) {
            this.cantidad = cantidad;
        }
    }
}