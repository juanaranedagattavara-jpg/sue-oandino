<?php
/**
 * Configuración de bloques personalizados
 * 
 * @package SueñoAndino
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Registrar estilos de bloques en el frontend
function sueno_andino_block_styles() {
    // Hero Block
    wp_enqueue_style(
        'sueno-andino-hero-block',
        get_template_directory_uri() . '/blocks/hero-block/style.css',
        array(),
        '1.0.0'
    );
    
    // Servicios Block
    wp_enqueue_style(
        'sueno-andino-servicios-block',
        get_template_directory_uri() . '/blocks/servicios-block/style.css',
        array(),
        '1.0.0'
    );
    
    // Equipo Block
    wp_enqueue_style(
        'sueno-andino-equipo-block',
        get_template_directory_uri() . '/blocks/equipo-block/style.css',
        array(),
        '1.0.0'
    );
    
    // Contacto Block
    wp_enqueue_style(
        'sueno-andino-contacto-block',
        get_template_directory_uri() . '/blocks/contacto-block/style.css',
        array(),
        '1.0.0'
    );
}
add_action('wp_enqueue_scripts', 'sueno_andino_block_styles');

// Registrar estilos de bloques en el editor
function sueno_andino_block_editor_styles() {
    wp_enqueue_style(
        'sueno-andino-blocks-editor',
        get_template_directory_uri() . '/assets/css/blocks-editor.css',
        array('wp-edit-blocks'),
        '1.0.0'
    );
}
add_action('enqueue_block_editor_assets', 'sueno_andino_block_editor_styles');

// Permitir bloques personalizados en el editor
function sueno_andino_allowed_block_types($allowed_blocks, $post) {
    // Agregar nuestros bloques personalizados
    $custom_blocks = [
        'sueño-andino/hero-block',
        'sueño-andino/servicios-block',
        'sueño-andino/equipo-block',
        'sueño-andino/contacto-block',
    ];
    
    return array_merge($allowed_blocks, $custom_blocks);
}
add_filter('allowed_block_types_all', 'sueno_andino_allowed_block_types', 10, 2);

// Configurar plantillas de bloques por defecto
function sueno_andino_block_templates() {
    $template = array(
        array('sueño-andino/hero-block'),
        array('sueño-andino/servicios-block'),
        array('sueño-andino/equipo-block'),
        array('sueño-andino/contacto-block'),
    );
    
    return $template;
}
add_filter('block_editor_settings_all', function($settings) {
    $settings['template'] = sueno_andino_block_templates();
    return $settings;
});

// AJAX para formulario de contacto
function sueno_andino_handle_contact_form() {
    // Verificar nonce
    if (!wp_verify_nonce($_POST['nonce'], 'sueno_andino_nonce')) {
        wp_die('Error de seguridad');
    }
    
    // Obtener datos del formulario
    $nombre = sanitize_text_field($_POST['nombre']);
    $email = sanitize_email($_POST['email']);
    $telefono = sanitize_text_field($_POST['telefono']);
    $tipo = sanitize_text_field($_POST['tipo']);
    $mensaje = sanitize_textarea_field($_POST['mensaje']);
    
    // Validar datos
    if (empty($nombre) || empty($email) || empty($mensaje)) {
        wp_send_json_error('Faltan campos obligatorios');
    }
    
    // Enviar email
    $to = get_option('admin_email');
    $subject = 'Nueva consulta desde Sueño Andino';
    $message = "Nombre: $nombre\nEmail: $email\nTeléfono: $telefono\nTipo: $tipo\nMensaje: $mensaje";
    $headers = array('Content-Type: text/html; charset=UTF-8');
    
    if (wp_mail($to, $subject, $message, $headers)) {
        wp_send_json_success('Mensaje enviado correctamente');
    } else {
        wp_send_json_error('Error al enviar el mensaje');
    }
}
add_action('wp_ajax_contact_form', 'sueno_andino_handle_contact_form');
add_action('wp_ajax_nopriv_contact_form', 'sueno_andino_handle_contact_form');