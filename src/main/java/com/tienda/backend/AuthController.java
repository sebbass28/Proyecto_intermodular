package com.tienda.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController
{
    @Autowired
    private ClienteRepository clienteRepository;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest)
    {
        Map<String, Object> response = new HashMap<>();

        try
        {
            Optional<Cliente> clienteOpt = clienteRepository.findByEmail(loginRequest.getEmail());

            if (clienteOpt.isPresent())
            {
                Cliente cliente = clienteOpt.get();

                if (cliente.getPassword() != null && cliente.getPassword().equals(loginRequest.getPassword()))
                {
                    response.put("success", true);
                    response.put("message", "Inicio de sesión exitoso");
                    response.put("cliente", createClienteResponse(cliente));
                    return ResponseEntity.ok(response);
                }
                else
                {
                    response.put("success", false);
                    response.put("message", "Contraseña incorrecta");
                    return ResponseEntity.badRequest().body(response);
                }
            }
            else
            {
                response.put("success", false);
                response.put("message", "Email no registrado");
                return ResponseEntity.badRequest().body(response);
            }
        }
        catch (Exception e)
        {
            response.put("success", false);
            response.put("message", "Error en el servidor: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest registerRequest)
    {
        Map<String, Object> response = new HashMap<>();

        try
        {
            // Verificar si el email ya existe
            Optional<Cliente> existingCliente = clienteRepository.findByEmail(registerRequest.getEmail());
            if (existingCliente.isPresent())
            {
                response.put("success", false);
                response.put("message", "El email ya está registrado");
                return ResponseEntity.badRequest().body(response);
            }

            // Crear nuevo cliente
            Cliente nuevoCliente = new Cliente();
            nuevoCliente.setNombre(registerRequest.getNombre());
            nuevoCliente.setApellido(registerRequest.getApellido());
            nuevoCliente.setEmail(registerRequest.getEmail());
            nuevoCliente.setTelefono(registerRequest.getTelefono());
            nuevoCliente.setDireccion(registerRequest.getDireccion());
            nuevoCliente.setPassword(registerRequest.getPassword());

            Cliente savedCliente = clienteRepository.save(nuevoCliente);

            response.put("success", true);
            response.put("message", "Registro exitoso");
            response.put("cliente", createClienteResponse(savedCliente));
            return ResponseEntity.ok(response);
        }
        catch (Exception e)
        {
            response.put("success", false);
            response.put("message", "Error en el servidor: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/validate-email")
    public ResponseEntity<Map<String, Object>> validateEmail(@RequestBody Map<String, String> request)
    {
        Map<String, Object> response = new HashMap<>();
        String email = request.get("email");

        Optional<Cliente> cliente = clienteRepository.findByEmail(email);
        response.put("exists", cliente.isPresent());

        return ResponseEntity.ok(response);
    }

    private Map<String, Object> createClienteResponse(Cliente cliente)
    {
        Map<String, Object> clienteData = new HashMap<>();
        clienteData.put("id", cliente.getId());
        clienteData.put("nombre", cliente.getNombre());
        clienteData.put("apellido", cliente.getApellido());
        clienteData.put("email", cliente.getEmail());
        clienteData.put("telefono", cliente.getTelefono());
        clienteData.put("direccion", cliente.getDireccion());
        // No incluir la contraseña en la respuesta
        return clienteData;
    }

    // Clases para las peticiones
    public static class LoginRequest
    {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest
    {
        private String nombre;
        private String apellido;
        private String email;
        private String telefono;
        private String direccion;
        private String password;

        public String getNombre() { return nombre; }
        public void setNombre(String nombre) { this.nombre = nombre; }
        public String getApellido() { return apellido; }
        public void setApellido(String apellido) { this.apellido = apellido; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getTelefono() { return telefono; }
        public void setTelefono(String telefono) { this.telefono = telefono; }
        public String getDireccion() { return direccion; }
        public void setDireccion(String direccion) { this.direccion = direccion; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}