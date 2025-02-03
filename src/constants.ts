export const STORAGE_KEY = "markdown-content";

export const EXAMPLE_MARKDOWN = `
# Guía de sintaxis Markdown

---

## Encabezados

# Esto es un Encabezado h1
## Esto es un Encabezado h2
### Esto es un Encabezado h3
#### Esto es un Encabezado h4
##### Esto es un Encabezado h5
###### Esto es un Encabezado h6

## Énfasis

*Este texto estará en cursiva*  
_Este texto también estará en cursiva_

**Este texto estará en negrita**  
__Este texto también estará en negrita__

_Puedes **combinarlos**_

## Listas

### No ordenadas

* Elemento 1
* Elemento 2
* Elemento 2a
* Elemento 2b
    * Elemento 3a
    * Elemento 3b

### Ordenadas

1. Elemento 1
2. Elemento 2
3. Elemento 3
    1. Elemento 3a
    2. Elemento 3b

## Imágenes

![Texto alternativo](https://i.giphy.com/2zUn8hAwJwG4abiS0p.webp "Título de la imagen")

## Enlaces

Puedes estar usando [Vista previa de Markdown](https://markdownlivepreview.com/).

## Citas

> Markdown es un lenguaje de marcado ligero con una sintaxis de formato de texto plano, creado en 2004 por John Gruber y Aaron Swartz.
>> Markdown se usa a menudo para formatear archivos README, escribir mensajes en foros de discusión en línea y crear texto enriquecido usando un editor de texto plano.

## Tablas

| Columnas izquierda | Columnas derecha |
| ----------------- |:----------------:|
| texto izquierda   | texto derecha    |
| texto izquierda   | texto derecha    |
| texto izquierda   | texto derecha    |

## Bloques de código

\`\`\`
let mensaje = '¡Hola mundo!';
alert(mensaje);
\`\`\`

## Código en línea

Este sitio web está usando \`markedjs/marked\`.
`;
