# Challenge: Markdown Editor con Preview

## Objetivo
Desarrollar un Editor de Markdown en el navegador que permita a los usuarios escribir y previsualizar texto en formato Markdown en tiempo real.

**Referencia de funcionamiento**: https://markdownlivepreview.com/

## Stack
* React
* TypeScript
* Vite: https://es.vite.dev/guide/ 
* Estilos: libre elección entre CSS Modules/Vanilla CSS o TailwindCSS

## Requisitos

**Editor de Markdown**
* Área de texto para escribir en formato Markdown (`<textarea>` o similar).
* Barra divisoria en la mitad de la pantalla que separe el código markdown de la previsualización
* La barra debe permitir ajustar el espacio de cada sección según necesidades del usuario
* Botón para sincronizar la preview y el contenido.
* Botones para limpiar y copiar el contenido.

**Previsualización en Tiempo Real**
* Conversión de Markdown a HTML con actualización automática
* No se permite el uso de dependencias para el formateo automático de Markdown. La implementación del parser de Markdown debe ser propia.

**Sintaxis Markdown a Soportar**
* Encabezados (#, ##, ###, etc.)
* Negritas (**texto**)
* Cursivas (*texto*)
* Listas ordenadas y no ordenadas
* Código en línea (`código`)
* Bloques de código (```código```)
* Citas (> cita)
* Líneas horizontales (---)
* Enlaces ([texto](url))
* Imágenes (![alt](url))

**Persistencia**
* Implementar localStorage para mantener el contenido al recargar la página

## Bonus
* Diseño responsive (versión mobile)
* Elemento fallback para URLs de imágenes no válidas
* Tema oscuro/claro

## Súper bonus
* Soporte para tablas en Markdown
* Exportación a HTML/Markdown
* Despliegue (Vercel, Netlify, etc.)

## Evaluación

**Se valorará**
* Cumplimiento de requisitos básicos al 100%
* Calidad y limpieza del código
* Mantenibilidad y organización del proyecto
* Documentación clara y completa
* Autonomía en la resolución de problemas (no consultar al Frontend Lead)
* Calidad y semántica de los commits (Gitlab) -> https://www.conventionalcommits.org/en/v1.0.0/

**Documentación Requerida**
* README con instrucciones de instalación y ejecución
* Estructura del proyecto
* Dependencias utilizadas (cuanto menos, mejor)
* Decisiones técnicas relevantes o comentarios (si es necesario)

## Entrega
* Repositorio: https://gitlab.e-cruce.com/cruce-team/cruce/frontend/capacitaciones/challenge01-markdown-live
* Crear rama con formato: nombre-apellido
* Fecha límite: viernes 31 de enero, final del día (a evaluar si se extienden los plazos)

### Devs 
- Luca Hardmeier. https://app.clickup.com/t/86b3q08cq
- Lucas Angiorama. https://app.clickup.com/t/86b3q0dwe 

¡A codear! 🚀 😸