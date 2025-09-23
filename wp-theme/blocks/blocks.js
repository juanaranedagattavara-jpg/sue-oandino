/**
 * Register all custom blocks
 */

import './hero-block/editor.js';
import './servicios-block/editor.js';
import './equipo-block/editor.js';
import './contacto-block/editor.js';

// Register block category
import { registerBlockCategory } from '@wordpress/blocks';

registerBlockCategory('sueño-andino', {
    title: 'Sueño Andino',
    icon: 'admin-site-alt3',
});
