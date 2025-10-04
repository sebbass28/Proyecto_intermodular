package com.tienda.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClienteController
{
    @Autowired
    private ClienteRepository clienteRepository;

    @GetMapping
    public List<Cliente> getAllClientes()
    {
        return clienteRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> getClienteById(@PathVariable Long id)
    {
        Optional<Cliente> cliente = clienteRepository.findById(id);
        if (cliente.isPresent())
        {
            return ResponseEntity.ok(cliente.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Cliente> getClienteByEmail(@PathVariable String email)
    {
        Optional<Cliente> cliente = clienteRepository.findByEmail(email);
        if (cliente.isPresent())
        {
            return ResponseEntity.ok(cliente.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public Cliente createCliente(@RequestBody Cliente cliente)
    {
        return clienteRepository.save(cliente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> updateCliente(@PathVariable Long id, @RequestBody Cliente clienteDetails)
    {
        Optional<Cliente> cliente = clienteRepository.findById(id);
        if (cliente.isPresent())
        {
            Cliente existingCliente = cliente.get();
            existingCliente.setNombre(clienteDetails.getNombre());
            existingCliente.setApellido(clienteDetails.getApellido());
            existingCliente.setEmail(clienteDetails.getEmail());
            existingCliente.setTelefono(clienteDetails.getTelefono());
            existingCliente.setDireccion(clienteDetails.getDireccion());
            if (clienteDetails.getPassword() != null)
            {
                existingCliente.setPassword(clienteDetails.getPassword());
            }
            return ResponseEntity.ok(clienteRepository.save(existingCliente));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCliente(@PathVariable Long id)
    {
        if (clienteRepository.existsById(id))
        {
            clienteRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}