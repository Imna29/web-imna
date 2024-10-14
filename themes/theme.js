import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{red.50}',
            100: '{red.100}',
            200: '{red.200}',
            300: '{red.300}',
            400: '{red.400}',
            500: '{red.500}',
            600: '{red.600}',
            700: '{red.700}',
            800: '{red.800}',
            900: '{red.900}',
            950: '{red.950}',
        },
        colorScheme: {
            dark: {
                primary: {
                    color: '{red.500}',
                }
            }
        }
    }
});

export default {
    preset: MyPreset,
    options: {
        darkModeSelector: '.app-dark-mode'
    }
};