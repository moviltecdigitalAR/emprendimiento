// Bot de WhatsApp para Demo Peluquería - Plan Ventas Automáticas
// Este script crea un bot interactivo en el demo

(function() {
  'use strict';

  // Configuración del bot
  const BOT_CONFIG = {
    numeroWhatsApp: '5492645304372',
    nombreNegocio: 'Studio Noir',
    delayMensaje: 800, // ms entre mensajes
  };

  // Estado del bot
  let estadoBot = 'inicio';
  let planSeleccionado = null;

  // Mensajes del bot
  const MENSAJES = {
    bienvenida: `👋 ¡Hola! Bienvenido a ${BOT_CONFIG.nombreNegocio}\n\nSoy el asistente virtual que te ayudará a conocer nuestros servicios.`,
    
    menuPrincipal: `¿En qué puedo ayudarte hoy?\n\n1️⃣ *Quiero más información* sobre los servicios\n2️⃣ *Quiero contratar* un plan de peluquería\n3️⃣ *Ver precios* de los servicios\n4️⃣ *Hablar con un humano*`,
    
    infoServicios: `💇 *Nuestros Servicios Premium:*\n\n✂️ *Corte Femenino* - $4.500\nIncluye lavado, masaje capilar y styling\n\n✨ *Balayage/Mechas* - desde $12.000\nTécnica francesa, efecto natural\n\n🎨 *Color Completo* - desde $8.500\nColoristas certificadas\n\n💨 *Keratina* - desde $18.000\nAlisado progresivo hasta 5 meses\n\n¿Te interesa alguno? Responde con el número del servicio o escribe *VOLVER*`,
    
    planesContratacion: `🚀 *PLANES DE PELUQUERÍA DIGITAL*\n\n*PLAN PRESENCIA* - $15.000/mes\n✓ Landing page profesional\n✓ Botón WhatsApp\n✓ Formulario de contacto\n✓ Sin mostrar precios\n\n*PLAN VENTAS* - $35.000/mes ⭐ RECOMENDADO\n✓ Todo lo anterior\n✓ Catálogo con precios\n✓ Carrito de compras\n✓ Reservas por WhatsApp\n\n*PLAN PRO* - $55.000/mes\n✓ Todo lo anterior\n✓ Sistema de turnos online\n✓ Recordatorios automáticos\n✓ Panel de administración\n\n¿Qué plan te interesa? Responde: *PRESENCIA*, *VENTAS* o *PRO*`,
    
    ventajasPlan: {
      presencia: `✨ *Plan Presencia - $15.000/mes*\n\n*Ideal para:* Quienes recién empiezan y quieren estar en internet\n\n*Ventajas:*\n✓ Presencia profesional online\n✓ Tus clientes te encuentran fácil\n✓ Formulario de contacto 24/7\n✓ Diseño adaptado a tu marca\n\n*Incluye:*\n- Página principal con tu info\n- Galería de trabajos\n- Botón WhatsApp directo\n- Diseño mobile-friendly\n\n¿Te gustaría contratar este plan? Responde *SÍ* para continuar o *VOLVER* para ver otros`,
      
      ventas: `⭐ *Plan Ventas - $35.000/mes* ⭐\n\n*Ideal para:* Profesionales que quieren vender más\n\n*Ventajas:*\n✓ Tus clientes ven precios claros\n✓ Pueden reservar turno directo\n✓ Catálogo de servicios profesional\n✓ Más conversiones = más clientes\n\n*Incluye todo lo del Plan Presencia PLUS:*\n- Catálogo con precios visibles\n- Sistema de reservas\n- Carrito de servicios\n- Confirmación por WhatsApp\n- Recordatorios automáticos\n\n💡 *Este es nuestro plan más popular*\n\n¿Te gustaría contratar este plan? Responde *SÍ* para continuar o *VOLVER* para ver otros`,
      
      pro: `🚀 *Plan Pro - $55.000/mes*\n\n*Ideal para:* Peluquerías con agenda llena que quieren automatizar\n\n*Ventajas:*\n✓ Sistema de turnos completo\n✓ Tus clientes eligen día y hora\n✓ Confirmaciones automáticas\n✓ Reducís llamadas telefónicas\n✓ Más tiempo para atender\n\n*Incluye todo lo del Plan Ventas PLUS:*\n- Calendario de turnos online\n- Gestión de disponibilidad\n- Cancelaciones y reprogramación\n- Base de datos de clientes\n- Estadísticas de reservas\n- Soporte prioritario\n\n¿Te gustaría contratar este plan? Responde *SÍ* para continuar o *VOLVER* para ver otros`
    },
    
    solicitarDatos: `📝 *¡Excelente elección!*\n\nPara crear tu web personalizada necesito estos datos:\n\n1️⃣ *Nombre de tu peluquería*\n2️⃣ *Tu número de WhatsApp* (para que te contacten)\n3️⃣ *Dirección y ciudad*\n4️⃣ *Horarios de atención*\n5️⃣ *Lista de servicios con precios*\n\n📎 Podés enviarme todo junto o completar el formulario:\n👉 https://moviltecdigital.com.ar/formulario-cliente.html\n\n⏰ *Te contactamos en menos de 24hs con tu web lista*`,
    
    contactoHumano: `👨‍💼 *Contacto con equipo humano*\n\nEntiendo que preferís hablar con una persona.\n\n📱 *WhatsApp directo:*\nhttps://wa.me/5492645304372\n\n✉️ *Email:*\nmoviltecdigital@gmail.com\n\n⏰ *Horario de atención:*\nLunes a Viernes: 9:00 - 18:00\n\n*Te respondemos en menos de 24hs*`,
    
    precios: `💰 *PRECIOS DE SERVICIOS*\n\n✂️ Corte Femenino - $4.500\n👨 Corte Masculino - $3.200\n✨ Balayage/Mechas - desde $12.000\n🎨 Color Completo - desde $8.500\n💨 Keratina - desde $18.000\n✨ Brushing - $3.500\n\n📅 *Reservá tu turno:*\nhttps://wa.me/5492645304372?text=Hola!%20Quiero%20reservar%20un%20turno`,
    
    noEntiendo: `🤔 No entendí tu mensaje.\n\nEscribí una de estas opciones:\n• *INFO* - Para conocer servicios\n• *PLANES* - Para ver planes disponibles\n• *PRECIOS* - Lista de precios\n• *HUMANO* - Hablar con una persona\n• *VOLVER* - Volver al menú principal`,
    
    despedida: `¡Gracias por contactarnos! 🙌\n\nEstamos para ayudarte a hacer crecer tu peluquería.\n\n📱 Guardá nuestro número y escribinos cuando quieras.\n\n*Studio Noir* 💇‍♀️✨`
  };

  // Función para abrir WhatsApp con mensaje
  function abrirWhatsApp(mensaje) {
    const url = `https://wa.me/${BOT_CONFIG.numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }

  // Función para mostrar mensaje del bot (simulado)
  function mostrarMensajeBot(mensaje) {
    // En una implementación real, esto mostraría un chat
    // Por ahora, abrimos WhatsApp directamente
    abrirWhatsApp(mensaje);
  }

  // Función principal del bot
  function iniciarBot(opcion) {
    switch(opcion) {
      case 'info':
        mostrarMensajeBot(MENSAJES.infoServicios);
        break;
      case 'planes':
        mostrarMensajeBot(MENSAJES.planesContratacion);
        break;
      case 'precios':
        mostrarMensajeBot(MENSAJES.precios);
        break;
      case 'humano':
        mostrarMensajeBot(MENSAJES.contactoHumano);
        break;
      case 'presencia':
        mostrarMensajeBot(MENSAJES.ventajasPlan.presencia);
        break;
      case 'ventas':
        mostrarMensajeBot(MENSAJES.ventajasPlan.ventas);
        break;
      case 'pro':
        mostrarMensajeBot(MENSAJES.ventajasPlan.pro);
        break;
      case 'contratar':
        mostrarMensajeBot(MENSAJES.solicitarDatos);
        break;
      default:
        mostrarMensajeBot(MENSAJES.bienvenida + '\n\n' + MENSAJES.menuPrincipal);
    }
  }

  // Exponer funciones globalmente
  window.WhatsAppBot = {
    iniciar: iniciarBot,
    mensajes: MENSAJES,
    config: BOT_CONFIG
  };

  // Interceptar clicks en botones de WhatsApp
  document.addEventListener('DOMContentLoaded', function() {
    // Botón flotante de WhatsApp
    const waFloat = document.querySelector('.wa-f');
    if (waFloat) {
      waFloat.addEventListener('click', function(e) {
        e.preventDefault();
        iniciarBot('inicio');
      });
    }

    // Botón de WhatsApp en hero
    const heroWa = document.querySelector('.btn-wa');
    if (heroWa) {
      heroWa.addEventListener('click', function(e) {
        e.preventDefault();
        iniciarBot('inicio');
      });
    }
  });

})();