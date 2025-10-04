package com.tienda.backend;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "productos")
public class Producto 
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private double precio;

    @Column(nullable = true)
    private String imagen;

    @Column(nullable = true)
    private String descripcion;

    @Column(nullable = true)
    private Integer stock;

	public Long getId() 
    {
		return id;
	}

	public void setId(Long id) 
    {
		this.id = id;
	}

	public String getNombre() 
    {
		return nombre;
	}

	public void setNombre(String nombre) 
    {
		this.nombre = nombre;
	}

	public double getPrecio() 
    {
		return precio;
	}
    
	public void setPrecio(double precio)
    {
		this.precio = precio;
	}

	public String getImagen()
    {
		return imagen;
	}

	public void setImagen(String imagen)
    {
		this.imagen = imagen;
	}

	public String getDescripcion()
    {
		return descripcion;
	}

	public void setDescripcion(String descripcion)
    {
		this.descripcion = descripcion;
	}

	public Integer getStock()
    {
		return stock;
	}

	public void setStock(Integer stock)
    {
		this.stock = stock;
	}
}
