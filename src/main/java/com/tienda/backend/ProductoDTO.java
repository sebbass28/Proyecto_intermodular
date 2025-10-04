package com.tienda.backend;

public class ProductoDTO {
    private Long id;
    private String nombre;
    private double precio;
    private String imagen; // Base64 string o URL
    private String descripcion;
    private Integer stock;

    public ProductoDTO() {}

    public ProductoDTO(Producto producto) {
        this.id = producto.getId();
        this.nombre = producto.getNombre();
        this.precio = producto.getPrecio();
        this.descripcion = producto.getDescripcion();
        this.stock = producto.getStock();

        // Usar la URL de imagen si existe, sino usar imagen por defecto
        if (producto.getImagen() != null && !producto.getImagen().trim().isEmpty()) {
            this.imagen = producto.getImagen();
        } else {
            // Usar imagen por defecto basada en el nombre del producto
            this.imagen = getDefaultImage(producto.getNombre());
        }
    }

    // Getters y setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    private String getDefaultImage(String nombreProducto) {
        // Generar una imagen placeholder basada en el nombre del producto
        String placeholder = "https://via.placeholder.com/300x300/667eea/ffffff?text=";
        if (nombreProducto != null) {
            String initials = nombreProducto.substring(0, Math.min(2, nombreProducto.length())).toUpperCase();
            return placeholder + initials;
        }
        return placeholder + "IMG";
    }
}