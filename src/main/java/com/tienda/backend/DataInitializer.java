package com.tienda.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner
{
    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Override
    public void run(String... args) throws Exception
    {
        if (productoRepository.count() == 0)
        {
            Producto producto1 = new Producto();
            producto1.setNombre("Osito Daisy Peluche");
            producto1.setPrecio(15.99);
            producto1.setDescripcion("Suave y tierno osito perfecto para acurrucarse");
            producto1.setStock(25);
            producto1.setImagen("/images/productos/osito-daisy.jpg");
            productoRepository.save(producto1);

            Producto producto2 = new Producto();
            producto2.setNombre("Conejito Rosa");
            producto2.setPrecio(18.99);
            producto2.setDescripcion("Adorable conejito en tono rosa pastel");
            producto2.setStock(30);
            producto2.setImagen("/images/productos/conejito-rosa.jpg");
            productoRepository.save(producto2);

            Producto producto3 = new Producto();
            producto3.setNombre("Elefante Francisca La Tierna");
            producto3.setPrecio(23.99);
            producto3.setDescripcion("Elefante suave con orejas extra grandes");
            producto3.setStock(20);
            producto3.setImagen("/images/productos/elefante-francisca.jpg");
            productoRepository.save(producto3);

            Producto producto4 = new Producto();
            producto4.setNombre("León Valiente");
            producto4.setPrecio(21.99);
            producto4.setDescripcion("León con melena esponjosa y sonrisa amigable");
            producto4.setStock(15);
            producto4.setImagen("/images/productos/leon-valiente.jpg");
            productoRepository.save(producto4);

            Producto producto5 = new Producto();
            producto5.setNombre("Pingüino Polar");
            producto5.setPrecio(19.99);
            producto5.setDescripcion("Pingüino suave con bufanda invernal");
            producto5.setStock(35);
            producto5.setImagen("/images/productos/pinguino-polar.jpg");
            productoRepository.save(producto5);

            Producto producto6 = new Producto();
            producto6.setNombre("Unicornio Mágico");
            producto6.setPrecio(25.99);
            producto6.setDescripcion("Unicornio brillante con cuerno dorado");
            producto6.setStock(18);
            producto6.setImagen("/images/productos/unicornio-magico.jpg");
            productoRepository.save(producto6);
        }

        if (clienteRepository.count() == 0)
        {
            Cliente cliente1 = new Cliente();
            cliente1.setNombre("Juan");
            cliente1.setApellido("Pérez");
            cliente1.setEmail("juan.perez@gmail.com");
            cliente1.setTelefono("123-456-7890");
            cliente1.setDireccion("Calle Principal 123, Madrid");
            cliente1.setPassword("password123");
            clienteRepository.save(cliente1);

            Cliente cliente2 = new Cliente();
            cliente2.setNombre("María");
            cliente2.setApellido("García");
            cliente2.setEmail("maria.garcia@gmail.com");
            cliente2.setTelefono("987-654-3210");
            cliente2.setDireccion("Avenida Central 456, Barcelona");
            cliente2.setPassword("password123");
            clienteRepository.save(cliente2);

            Cliente cliente3 = new Cliente();
            cliente3.setNombre("Carlos");
            cliente3.setApellido("López");
            cliente3.setEmail("carlos.lopez@gmail.com");
            cliente3.setTelefono("555-123-4567");
            cliente3.setDireccion("Plaza Mayor 789, Valencia");
            cliente3.setPassword("password123");
            clienteRepository.save(cliente3);

            Cliente cliente4 = new Cliente();
            cliente4.setNombre("Ana");
            cliente4.setApellido("Martínez");
            cliente4.setEmail("ana.martinez@gmail.com");
            cliente4.setTelefono("444-555-6666");
            cliente4.setDireccion("Calle Nueva 321, Sevilla");
            cliente4.setPassword("password123");
            clienteRepository.save(cliente4);

            Cliente cliente5 = new Cliente();
            cliente5.setNombre("Roberto");
            cliente5.setApellido("Sánchez");
            cliente5.setEmail("roberto.sanchez@gmail.com");
            cliente5.setTelefono("777-888-9999");
            cliente5.setDireccion("Paseo del Prado 654, Bilbao");
            cliente5.setPassword("password123");
            clienteRepository.save(cliente5);
        }

        System.out.println("Base de datos inicializada con productos y clientes de ejemplo");
    }
}