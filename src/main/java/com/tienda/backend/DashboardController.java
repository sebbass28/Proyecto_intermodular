package com.tienda.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController
{
    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private CarritoRepository carritoRepository;

    @GetMapping("/estadisticas")
    public Map<String, Object> getEstadisticas()
    {
        Map<String, Object> stats = new HashMap<>();

        // Estadísticas básicas
        stats.put("totalProductos", productoRepository.count());
        stats.put("totalClientes", clienteRepository.count());
        stats.put("totalCarritos", carritoRepository.count());

        // Estadísticas de stock
        long productosEnStock = productoRepository.findAll().stream()
            .filter(p -> p.getStock() != null && p.getStock() > 0)
            .count();
        stats.put("productosEnStock", productosEnStock);

        long productosStockBajo = productoRepository.findAll().stream()
            .filter(p -> p.getStock() != null && p.getStock() > 0 && p.getStock() < 10)
            .count();
        stats.put("productosStockBajo", productosStockBajo);

        long productosSinStock = productoRepository.findAll().stream()
            .filter(p -> p.getStock() == null || p.getStock() == 0)
            .count();
        stats.put("productosSinStock", productosSinStock);

        // Valor total del inventario
        double valorInventario = productoRepository.findAll().stream()
            .filter(p -> p.getStock() != null && p.getStock() > 0)
            .mapToDouble(p -> p.getPrecio() * p.getStock())
            .sum();
        stats.put("valorTotalInventario", valorInventario);

        return stats;
    }

    @GetMapping("/resumen")
    public Map<String, Object> getResumen()
    {
        Map<String, Object> resumen = new HashMap<>();

        // Productos más caros
        productoRepository.findAll().stream()
            .max((p1, p2) -> Double.compare(p1.getPrecio(), p2.getPrecio()))
            .ifPresent(producto -> {
                Map<String, Object> productoMasCaro = new HashMap<>();
                productoMasCaro.put("nombre", producto.getNombre());
                productoMasCaro.put("precio", producto.getPrecio());
                resumen.put("productoMasCaro", productoMasCaro);
            });

        // Productos más baratos
        productoRepository.findAll().stream()
            .min((p1, p2) -> Double.compare(p1.getPrecio(), p2.getPrecio()))
            .ifPresent(producto -> {
                Map<String, Object> productoMasBarato = new HashMap<>();
                productoMasBarato.put("nombre", producto.getNombre());
                productoMasBarato.put("precio", producto.getPrecio());
                resumen.put("productoMasBarato", productoMasBarato);
            });

        // Precio promedio
        double precioPromedio = productoRepository.findAll().stream()
            .mapToDouble(Producto::getPrecio)
            .average()
            .orElse(0.0);
        resumen.put("precioPromedio", precioPromedio);

        return resumen;
    }
}