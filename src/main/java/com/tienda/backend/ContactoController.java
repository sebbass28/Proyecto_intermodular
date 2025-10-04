package com.tienda.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/contacto")
@CrossOrigin(origins = "*")
public class ContactoController
{
    @Autowired
    private ContactoRepository contactoRepository;

    @PostMapping
    public ResponseEntity<String> guardarContacto(@RequestBody Contacto contacto)
    {
        try {
            contactoRepository.save(contacto);
            return ResponseEntity.ok("Mensaje enviado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al enviar el mensaje");
        }
    }

    @GetMapping
    public List<Contacto> obtenerContactos()
    {
        return contactoRepository.findAll();
    }
}