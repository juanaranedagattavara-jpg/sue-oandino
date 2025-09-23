<?php
/**
 * Template Name: Página Principal
 * 
 * @package SueñoAndino
 */

get_header(); ?>

<main id="main" class="site-main">
    <?php
    // Mostrar bloques de la página
    if (have_posts()) :
        while (have_posts()) : the_post();
            the_content();
        endwhile;
    else :
        // Contenido por defecto si no hay bloques
        ?>
        <div class="container">
            <div class="no-content">
                <h1>Bienvenido a Sueño Andino</h1>
                <p>Esta es la página principal. Agrega bloques desde el editor de WordPress.</p>
            </div>
        </div>
        <?php
    endif;
    ?>
</main>

<?php get_footer(); ?>