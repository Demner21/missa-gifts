### Soporte de Idioma – Español

**Requerimiento**

* La aplicación debe estar disponible en **idioma español**.
* Todos los textos visibles para el usuario deben mostrarse en español, incluyendo:

  * Títulos y encabezados
  * Botones (por ejemplo: *“Draw Next Gift” → “Sortear siguiente regalo”*)
  * Mensajes de estado y resultados
  * Validaciones y mensajes de error

**Consideraciones**

* Los textos no deben estar **hardcodeados** en los componentes.
* Se debe utilizar un mecanismo de **internacionalización (i18n)** que permita:

  * Mantener los textos centralizados.
  * Facilitar futuras traducciones a otros idiomas (por ejemplo, inglés).
* El español debe ser el **idioma por defecto** de la aplicación.

**Opcional**

* Permitir cambiar el idioma desde la interfaz (ES / EN).
* Detectar automáticamente el idioma del navegador y usarlo como idioma inicial.